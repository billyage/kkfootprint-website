const DEFAULT_MAX_PAYLOAD_BYTES = 16 * 1024;
const MAX_CONFIGURABLE_PAYLOAD_BYTES = 64 * 1024;

const ALLOWED_FIELDS = new Set([
  'name',
  'contact',
  'email',
  'tour',
  'date',
  'hotel',
  'adults',
  'children',
  'type',
  'vehicle',
  'requests',
  'language',
  'channel',
  'turnstileToken',
]);
const CHAT_START_FIELDS = new Set([
  'name',
  'telegram',
  'email',
  'language',
  'channel',
  'marketingConsent',
  'privacyNoticeVersion',
  'turnstileToken',
]);
const CHAT_MESSAGE_FIELDS = new Set([
  'conversationId',
  'message',
  'language',
  'channel',
  'turnstileToken',
]);
const CHAT_REPLY_POLL_FIELDS = new Set([
  'conversationId',
  'ticketId',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return Response.redirect(new URL('/en/', url), 302);
    }

    if (['/en', '/zh-hans', '/ko'].includes(url.pathname)) {
      return Response.redirect(new URL(`${url.pathname}/`, url), 301);
    }

    if (['/en/', '/zh-hans/', '/ko/'].includes(url.pathname)) {
      return env.ASSETS.fetch(new Request(new URL('/', url), request));
    }

    if (url.pathname === '/api/rex/chat/start') {
      return handleChatStart(request, env);
    }

    if (url.pathname === '/api/rex/chat/messages') {
      return handleChatMessage(request, env);
    }

    if (url.pathname === '/api/rex/chat/replies') {
      return handleChatReplyPoll(request, env);
    }

    if (url.pathname !== '/api/rex/leads') {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, {
        Allow: 'POST',
      });
    }

    try {
      validateOrigin(request, env);
      ensureJsonContentType(request);

      const maxPayloadBytes = getMaxPayloadBytes(env);
      const requestBody = await readJsonBody(request, maxPayloadBytes);
      validateAllowedFields(requestBody);

      const turnstileToken = normalizeOptionalSingleLine(requestBody.turnstileToken, 4096);
      await verifyTurnstileIfEnabled(turnstileToken, request, env);

      const booking = normalizeBooking(requestBody);
      const language = normalizeLanguage(requestBody.language);
      const channel = normalizeCustomerChannel(requestBody.channel);
      const requestId = crypto.randomUUID();
      const receivedAt = new Date().toISOString();
      const upstreamPayload = {
        requestId,
        receivedAt,
        source: 'website_booking_form',
        language,
        channel,
        booking,
      };
      const serializedPayload = JSON.stringify(upstreamPayload);
      const signature = await createHmacSignature(
        env.REX_CUSTOMER_HMAC_SECRET,
        receivedAt,
        serializedPayload,
      );
      const n8nWebhookUrl = getN8nWebhookUrl(env);

      const upstreamResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-REX-Timestamp': receivedAt,
          'X-REX-Signature': signature,
          'X-REX-Request-Id': requestId,
        },
        body: serializedPayload,
      });

      if (!upstreamResponse.ok) {
        console.error('n8n intake returned a non-success status', {
          requestId,
          status: upstreamResponse.status,
        });
        return jsonResponse(
          { error: 'upstream_unavailable', message: 'We could not send your request. Please try again shortly.' },
          502,
        );
      }

      return jsonResponse(
        { ok: true, requestId, message: 'Your booking request has been received.' },
        202,
      );
    } catch (error) {
      if (error instanceof HttpError) {
        return jsonResponse({ error: error.code, message: error.message }, error.status);
      }

      console.error('Unexpected lead intake error', { name: error?.name, message: error?.message });
      return jsonResponse(
        { error: 'service_unavailable', message: 'We could not send your request. Please try again shortly.' },
        502,
      );
    }
  },
};

async function handleChatStart(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }

  try {
    validateOrigin(request, env);
    ensureJsonContentType(request);
    const body = await readJsonBody(request, getMaxPayloadBytes(env));
    validateFields(body, CHAT_START_FIELDS);
    const turnstileToken = normalizeOptionalSingleLine(body.turnstileToken, 4096);
    await verifyTurnstileIfEnabled(turnstileToken, request, env);

    const chatLead = {
      name: normalizeRequiredSingleLine(body.name, 160, 'name'),
      telegram: normalizeTelegram(body.telegram),
      email: normalizeRequiredEmail(body.email),
      language: normalizeLanguage(body.language),
      channel: normalizeCustomerChannel(body.channel),
      marketingConsent: body.marketingConsent === true,
      privacyNoticeVersion: normalizeRequiredSingleLine(body.privacyNoticeVersion, 32, 'privacy notice version'),
    };
    const forwarded = await forwardSignedPayload(request, env, 'website_chat_started', {
      language: chatLead.language,
      channel: chatLead.channel,
      chatLead,
    });
    const conversationId = normalizeUpstreamText(forwarded.body?.conversationId, 160) || forwarded.requestId;
    const reply = normalizeUpstreamText(forwarded.body?.reply, 4000);

    return jsonResponse({ ok: true, requestId: forwarded.requestId, conversationId, reply }, 201);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function handleChatMessage(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }

  try {
    validateOrigin(request, env);
    ensureJsonContentType(request);
    const body = await readJsonBody(request, getMaxPayloadBytes(env));
    validateFields(body, CHAT_MESSAGE_FIELDS);
    const turnstileToken = normalizeOptionalSingleLine(body.turnstileToken, 4096);
    await verifyTurnstileIfEnabled(turnstileToken, request, env);

    const chatMessage = {
      conversationId: normalizeRequiredSingleLine(body.conversationId, 160, 'conversation'),
      message: normalizeOptionalMultiline(body.message, 2000),
      language: normalizeLanguage(body.language),
      channel: normalizeCustomerChannel(body.channel),
    };
    if (!chatMessage.message) throw new HttpError(400, 'invalid_field', 'Please enter a message.');

    const forwarded = await forwardSignedPayload(request, env, 'website_chat_message', {
      language: chatMessage.language,
      channel: chatMessage.channel,
      chatMessage,
    });
    const reply = normalizeUpstreamText(forwarded.body?.reply, 4000);
    if (!reply) throw new HttpError(502, 'invalid_upstream_response', 'REX could not reply just now. Please try again.');

    return jsonResponse({
      ok: true,
      requestId: forwarded.requestId,
      status: normalizeUpstreamText(forwarded.body?.status, 32),
      ticketId: normalizeUpstreamText(forwarded.body?.ticketId, 160),
      reply,
    }, 200);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function handleChatReplyPoll(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }

  try {
    validateOrigin(request, env);
    ensureJsonContentType(request);
    const body = await readJsonBody(request, getMaxPayloadBytes(env));
    validateFields(body, CHAT_REPLY_POLL_FIELDS);

    const chatPoll = {
      conversationId: normalizeRequiredSingleLine(body.conversationId, 160, 'conversation'),
      ticketId: normalizeRequiredSingleLine(body.ticketId, 160, 'ticket'),
    };
    const forwarded = await forwardSignedPayload(request, env, 'website_chat_reply_poll', { chatPoll });
    const reply = normalizeUpstreamText(forwarded.body?.reply, 4000);
    const status = normalizeUpstreamText(forwarded.body?.status, 32) || 'pending';

    return jsonResponse({ ok: true, requestId: forwarded.requestId, status, reply }, 200);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function forwardSignedPayload(request, env, source, content) {
  const requestId = crypto.randomUUID();
  const receivedAt = new Date().toISOString();
  const payload = JSON.stringify({ requestId, receivedAt, source, ...content });
  const signature = await createHmacSignature(env.REX_CUSTOMER_HMAC_SECRET, receivedAt, payload);
  const webhookUrl = getN8nChatWebhookUrl(env);
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-REX-Timestamp': receivedAt,
      'X-REX-Signature': signature,
      'X-REX-Request-Id': requestId,
    },
    body: payload,
  });

  if (!response.ok) {
    console.error('n8n chat intake returned a non-success status', { requestId, status: response.status });
    throw new HttpError(502, 'upstream_unavailable', 'REX could not reply just now. Please try again.');
  }

  return { requestId, body: await response.json().catch(() => ({})) };
}

function handleRequestError(error) {
  if (error instanceof HttpError) {
    return jsonResponse({ error: error.code, message: error.message }, error.status);
  }
  console.error('Unexpected chat intake error', { name: error?.name, message: error?.message });
  return jsonResponse({ error: 'service_unavailable', message: 'REX could not reply just now. Please try again.' }, 502);
}

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

function validateOrigin(request, env) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = getAllowedOrigins(env);

  if (!origin || !allowedOrigins.has(origin)) {
    throw new HttpError(403, 'origin_not_allowed', 'This request is not allowed.');
  }
}

function getAllowedOrigins(env) {
  if (!env.ALLOWED_ORIGINS) {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }

  const origins = new Set();
  for (const value of env.ALLOWED_ORIGINS.split(',')) {
    const candidate = value.trim();
    if (!candidate) continue;
    try {
      origins.add(new URL(candidate).origin);
    } catch {
      throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
    }
  }

  if (origins.size === 0) {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }
  return origins;
}

function ensureJsonContentType(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'unsupported_media_type', 'A JSON request is required.');
  }
}

function getMaxPayloadBytes(env) {
  const configuredValue = Number(env.MAX_PAYLOAD_BYTES ?? DEFAULT_MAX_PAYLOAD_BYTES);
  if (!Number.isInteger(configuredValue) || configuredValue < 1024) {
    return DEFAULT_MAX_PAYLOAD_BYTES;
  }
  return Math.min(configuredValue, MAX_CONFIGURABLE_PAYLOAD_BYTES);
}

function getN8nWebhookUrl(env) {
  if (!env.N8N_WEBHOOK_URL) {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }
  try {
    const url = new URL(env.N8N_WEBHOOK_URL);
    if (url.protocol !== 'https:') throw new Error('HTTPS required');
    return url.toString();
  } catch {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }
}

function getN8nChatWebhookUrl(env) {
  const configuredUrl = env.N8N_CHAT_WEBHOOK_URL || env.N8N_WEBHOOK_URL;
  if (!configuredUrl) {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }
  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== 'https:') throw new Error('HTTPS required');
    return url.toString();
  } catch {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }
}

async function readJsonBody(request, maxPayloadBytes) {
  const declaredLength = Number(request.headers.get('Content-Length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxPayloadBytes) {
    throw new HttpError(413, 'payload_too_large', 'The request is too large.');
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > maxPayloadBytes) {
    throw new HttpError(413, 'payload_too_large', 'The request is too large.');
  }

  try {
    const value = JSON.parse(new TextDecoder().decode(bytes));
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('Expected object');
    }
    return value;
  } catch {
    throw new HttpError(400, 'invalid_json', 'Invalid request data.');
  }
}

function validateAllowedFields(data) {
  validateFields(data, ALLOWED_FIELDS);
}

function validateFields(data, allowedFields) {
  for (const key of Object.keys(data)) {
    if (!allowedFields.has(key)) throw new HttpError(400, 'unexpected_field', 'Invalid request data.');
  }
}

function normalizeBooking(data) {
  return {
    name: normalizeRequiredSingleLine(data.name, 160, 'name'),
    contact: normalizeTelegram(data.contact),
    email: normalizeEmail(data.email),
    tour: normalizeRequiredSingleLine(data.tour, 160, 'tour'),
    date: normalizeOptionalSingleLine(data.date, 64),
    hotel: normalizeOptionalSingleLine(data.hotel, 300),
    adults: normalizeInteger(data.adults, 1, 100, 'adults'),
    children: normalizeInteger(data.children, 0, 100, 'children'),
    type: normalizeOptionalSingleLine(data.type, 40),
    vehicle: normalizeOptionalSingleLine(data.vehicle, 80),
    requests: normalizeOptionalMultiline(data.requests, 2000),
  };
}

function normalizeRequiredSingleLine(value, maxLength, field) {
  const normalized = normalizeOptionalSingleLine(value, maxLength);
  if (!normalized) {
    throw new HttpError(400, 'invalid_field', `Please provide a valid ${field}.`);
  }
  return normalized;
}

function normalizeOptionalSingleLine(value, maxLength) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string') {
    throw new HttpError(400, 'invalid_field', 'Invalid request data.');
  }
  const normalized = value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (normalized.length > maxLength) {
    throw new HttpError(400, 'invalid_field', 'Invalid request data.');
  }
  return normalized;
}

function normalizeOptionalMultiline(value, maxLength) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string') {
    throw new HttpError(400, 'invalid_field', 'Invalid request data.');
  }
  const normalized = value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
  if (normalized.length > maxLength) {
    throw new HttpError(400, 'invalid_field', 'Invalid request data.');
  }
  return normalized;
}

function normalizeEmail(value) {
  const email = normalizeOptionalSingleLine(value, 254).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'invalid_field', 'Please provide a valid email address.');
  }
  return email;
}

function normalizeRequiredEmail(value) {
  const email = normalizeEmail(value);
  if (!email) throw new HttpError(400, 'invalid_field', 'Please provide a valid email.');
  return email;
}

function normalizeTelegram(value) {
  const username = normalizeRequiredSingleLine(value, 33, 'Telegram username').replace(/^@?/, '@');
  if (!/^@[A-Za-z0-9_]{5,32}$/.test(username)) {
    throw new HttpError(400, 'invalid_field', 'Please provide a valid Telegram username.');
  }
  return username;
}

function normalizeLanguage(value) {
  const language = normalizeOptionalSingleLine(value, 12).toLowerCase();
  return ['en', 'zh', 'ko'].includes(language) ? language : 'en';
}

function normalizeCustomerChannel(value) {
  if (value !== 'customer_web') {
    throw new HttpError(400, 'invalid_field', 'Invalid request channel.');
  }
  return 'customer_web';
}

function normalizeUpstreamText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

function normalizeInteger(value, min, max, field) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new HttpError(400, 'invalid_field', `Please provide a valid ${field}.`);
  }
  const normalized = String(value).trim();
  if (!/^(0|[1-9]\d*)$/.test(normalized)) {
    throw new HttpError(400, 'invalid_field', `Please provide a valid ${field}.`);
  }
  const integer = Number(normalized);
  if (!Number.isSafeInteger(integer) || integer < min || integer > max) {
    throw new HttpError(400, 'invalid_field', `Please provide a valid ${field}.`);
  }
  return integer;
}

async function verifyTurnstileIfEnabled(token, request, env) {
  if (String(env.TURNSTILE_ENABLED ?? 'false').toLowerCase() !== 'true') return;

  if (!env.TURNSTILE_SECRET_KEY) {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }
  if (!token) {
    throw new HttpError(403, 'turnstile_failed', 'Verification failed. Please try again.');
  }

  const formData = new FormData();
  formData.set('secret', env.TURNSTILE_SECRET_KEY);
  formData.set('response', token);
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) formData.set('remoteip', remoteIp);

  let response;
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new HttpError(502, 'verification_unavailable', 'Verification is temporarily unavailable. Please try again.');
  }

  if (!response.ok) {
    throw new HttpError(502, 'verification_unavailable', 'Verification is temporarily unavailable. Please try again.');
  }

  const result = await response.json().catch(() => null);
  const expectedHostname = new URL(request.headers.get('Origin')).hostname;
  if (!result?.success || result.hostname !== expectedHostname) {
    throw new HttpError(403, 'turnstile_failed', 'Verification failed. Please try again.');
  }
}

async function createHmacSignature(secret, timestamp, serializedPayload) {
  if (!secret) {
    throw new HttpError(500, 'service_misconfigured', 'This service is not configured.');
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${timestamp}.${serializedPayload}`),
  );
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
