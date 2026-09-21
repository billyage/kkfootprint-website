const DEFAULT_MAX_PAYLOAD_BYTES = 16 * 1024;
const MAX_CONFIGURABLE_PAYLOAD_BYTES = 64 * 1024;
const MAX_RECEIPT_BYTES = 15 * 1024 * 1024;
const RECEIPT_REVIEW_TTL_MS = 24 * 60 * 60 * 1000;
const MEDIA_DRAFT_MAX_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const MEDIA_DRAFT_PREFIX = 'media-drafts/';
const RECEIPT_FILE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['application/pdf', 'pdf'],
]);

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
  'pageContext',
  'turnstileToken',
]);
const CHAT_REPLY_POLL_FIELDS = new Set([
  'conversationId',
  'ticketId',
]);
const ADMIN_STAFF_REPLY_FIELDS = new Set([
  'conversationId',
  'message',
]);
const TOUR_DETAIL_PATHS = new Set([
  // City Tour
  '/tours/city-tour/',
  '/zh-hans/tours/city-tour/',
  '/ko/tours/city-tour/',
  // Mengalum Island
  '/tours/mengalum-island/',
  '/zh-hans/tours/mengalum-island/',
  '/ko/tours/mengalum-island/',
  // Mantanani Island
  '/tours/mantanani-island/',
  '/zh-hans/tours/mantanani-island/',
  '/ko/tours/mantanani-island/',
  // Twin Island Hopping
  '/tours/twin-island-hopping/',
  '/zh-hans/tours/twin-island-hopping/',
  '/ko/tours/twin-island-hopping/',
  // Kundasang ATV & Farm
  '/tours/kundasang-atv-farm/',
  '/zh-hans/tours/kundasang-atv-farm/',
  '/ko/tours/kundasang-atv-farm/',
  // Firefly Safari
  '/tours/firefly-safari/',
  '/zh-hans/tours/firefly-safari/',
  '/ko/tours/firefly-safari/',
  // Mari-Mari Cultural Village
  '/tours/mari-mari-cultural-village/',
  '/zh-hans/tours/mari-mari-cultural-village/',
  '/ko/tours/mari-mari-cultural-village/',
]);
const TOUR_DETAIL_SEO = {
  // City Tour
  '/tours/city-tour/': { lang: 'en', title: 'Kota Kinabalu City Highlights Tour | Hotel Pickup & Photo Stops - KKfootprint', description: 'Book a relaxed Kota Kinabalu city tour with hotel pickup, city mosque, Sabah Foundation Building and UMS photo stops.', alternates: { en: '/tours/city-tour/', zh: '/zh-hans/tours/city-tour/', ko: '/ko/tours/city-tour/' } },
  '/zh-hans/tours/city-tour/': { lang: 'zh-Hans', title: '亚庇市区经典观光半日游 | 酒店接送、水上清真寺与沙巴大学 - KKfootprint', description: '预订沙巴亚庇市区半日游：舒适冷气专车接送、打卡水上清真寺、敦慕斯达法大厦、沙巴大学粉红清真寺与观景点。', alternates: { en: '/tours/city-tour/', zh: '/zh-hans/tours/city-tour/', ko: '/ko/tours/city-tour/' } },
  '/ko/tours/city-tour/': { lang: 'ko', title: '코타키나발루 시티 투어 | 호텔 픽업·블루모스크·핑크모스크 - KKfootprint', description: '코타키나발루 핵심 명소를 편안하게 둘러보는 시티 반일 투어: 호텔 픽업, 시티 모스크(블루모스크), 사바 재단 빌딩, UMS 핑크모스크.', alternates: { en: '/tours/city-tour/', zh: '/zh-hans/tours/city-tour/', ko: '/ko/tours/city-tour/' } },

  // Mengalum Island
  '/tours/mengalum-island/': { lang: 'en', title: 'Mengalum Island Day Tour from Kota Kinabalu | Hotel Pickup & Snorkelling', description: 'Book a Mengalum Island day trip from Kota Kinabalu with estimated hotel pickup, boat transfer, guided snorkeling, beach time and buffet lunch.', alternates: { en: '/tours/mengalum-island/', zh: '/zh-hans/tours/mengalum-island/', ko: '/ko/tours/mengalum-island/' } },
  '/zh-hans/tours/mengalum-island/': { lang: 'zh-Hans', title: '亚庇曼加伦岛一日游 | 酒店接送、浮潜与自助午餐', description: '从亚庇出发前往曼加伦岛的一日游：预计酒店接送、码头登记、浮潜、海滩时间与自助午餐。', alternates: { en: '/tours/mengalum-island/', zh: '/zh-hans/tours/mengalum-island/', ko: '/ko/tours/mengalum-island/' } },
  '/ko/tours/mengalum-island/': { lang: 'ko', title: '코타키나발루 멩갈룸 섬 투어 | 호텔 픽업·스노클링·점심', description: '코타키나발루에서 출발하는 멩갈룸 섬 당일 투어: 예상 호텔 픽업, 제티 등록, 스노클링, 해변 휴식과 뷔페 점심이 포함됩니다.', alternates: { en: '/tours/mengalum-island/', zh: '/zh-hans/tours/mengalum-island/', ko: '/ko/tours/mengalum-island/' } },

  // Mantanani Island
  '/tours/mantanani-island/': { lang: 'en', title: 'Mantanani Island Snorkeling Day Tour from Kota Kinabalu | KKfootprint', description: 'Book a full-day Mantanani Island snorkeling trip from Kota Kinabalu: speedboat transfers, two guided boat snorkeling sessions, coral reefs, white sand beach and buffet lunch.', alternates: { en: '/tours/mantanani-island/', zh: '/zh-hans/tours/mantanani-island/', ko: '/ko/tours/mantanani-island/' } },
  '/zh-hans/tours/mantanani-island/': { lang: 'zh-Hans', title: '亚庇美人鱼岛出海浮潜一日游 | 绝美果冻海、细软白沙滩与海岛自助午餐 - KKfootprint', description: '亚庇出发美人鱼岛一日游：快艇往返接送、面粉白沙滩、2次出海导览浮潜与热带鱼群互动、海岛自助午餐与惬意海滩时光。', alternates: { en: '/tours/mantanani-island/', zh: '/zh-hans/tours/mantanani-island/', ko: '/ko/tours/mantanani-island/' } },
  '/ko/tours/mantanani-island/': { lang: 'ko', title: '코타키나발루 만타나니 섬 스노클링 투어 | 에메랄드빛 바다 & 화이트 비치 - KKfootprint', description: '코타키나발루 만타나니 섬 데이투어: 쾌속선 이동, 에메랄드빛 바다 산호초 2회 보트 스노클링, 하얀 모래사장과 섬 뷔페 점심.', alternates: { en: '/tours/mantanani-island/', zh: '/zh-hans/tours/mantanani-island/', ko: '/ko/tours/mantanani-island/' } },

  // Twin Island Hopping
  '/tours/twin-island-hopping/': { lang: 'en', title: 'Twin Island Hopping from Kota Kinabalu | KKfootprint Travel', description: 'Choose two islands from Sapi, Manukan and Mamutik for a Kota Kinabalu island-hopping day with snorkeling gear.', alternates: { en: '/tours/twin-island-hopping/', zh: '/zh-hans/tours/twin-island-hopping/', ko: '/ko/tours/twin-island-hopping/' } },
  '/zh-hans/tours/twin-island-hopping/': { lang: 'zh-Hans', title: '亚庇双岛跳岛游 | 沙比岛·马努干岛·马穆迪岛任选两岛 - KKfootprint', description: '从沙比岛、马努干岛和马穆迪岛中任选两座岛屿：享受阳光沙滩、浮潜装备与快艇接送，全日海岛休闲。', alternates: { en: '/tours/twin-island-hopping/', zh: '/zh-hans/tours/twin-island-hopping/', ko: '/ko/tours/twin-island-hopping/' } },
  '/ko/tours/twin-island-hopping/': { lang: 'ko', title: '코타키나발루 트윈 아일랜드 호핑투어 | 사피·마누칸·마무틱 - KKfootprint', description: '사피, 마누칸, 마무틱 섬 중 2개 섬을 선택하여 즐기는 유연한 호핑투어: 왕복 보트, 스노클링 장비, 해변 휴식 포함.', alternates: { en: '/tours/twin-island-hopping/', zh: '/zh-hans/tours/twin-island-hopping/', ko: '/ko/tours/twin-island-hopping/' } },

  // Kundasang ATV & Farm
  '/tours/kundasang-atv-farm/': { lang: 'en', title: 'Kundasang ATV and Desa Farm Tour from Kota Kinabalu | KKfootprint Travel', description: 'Take a Kundasang day trip from Kota Kinabalu with Pekan Nabalu views, guided ATV, Desa Cattle Dairy Farm and lunch.', alternates: { en: '/tours/kundasang-atv-farm/', zh: '/zh-hans/tours/kundasang-atv-farm/', ko: '/ko/tours/kundasang-atv-farm/' } },
  '/zh-hans/tours/kundasang-atv-farm/': { lang: 'zh-Hans', title: '沙巴神山昆达山一日游 | 越野ATV、德萨奶牛牧场与壮丽神山 - KKfootprint', description: '从亚庇出发探索神山昆达山：打卡纳巴鲁观景点、刺激越野ATV体验、参观沙巴“小新西兰”德萨奶牛场并享用午餐。', alternates: { en: '/tours/kundasang-atv-farm/', zh: '/zh-hans/tours/kundasang-atv-farm/', ko: '/ko/tours/kundasang-atv-farm/' } },
  '/ko/tours/kundasang-atv-farm/': { lang: 'ko', title: '코타키나발루 쿤다상 ATV & 데사 목장 투어 | 키나발루산 고원 - KKfootprint', description: '키나발루산의 절경을 감상하는 고원 당일 투어: 나발루 전망대, 오프로드 가이드 ATV, 데사 밀크 팜(낙농목장) 및 점심 식사.', alternates: { en: '/tours/kundasang-atv-farm/', zh: '/zh-hans/tours/kundasang-atv-farm/', ko: '/ko/tours/kundasang-atv-farm/' } },

  // Firefly Safari
  '/tours/firefly-safari/': { lang: 'en', title: 'Firefly Safari and River Cruise from Kota Kinabalu | KKfootprint Travel', description: 'Join a Kota Kinabalu firefly safari with wildlife river cruise, Borneo sunset, buffet dinner and night firefly viewing.', alternates: { en: '/tours/firefly-safari/', zh: '/zh-hans/tours/firefly-safari/', ko: '/ko/tours/firefly-safari/' } },
  '/zh-hans/tours/firefly-safari/': { lang: 'zh-Hans', title: '沙巴红树林长鼻猴与萤火虫生态之旅 | 婆罗洲日落与丰盛晚餐 - KKfootprint', description: '亚庇经典红树林生态半日游：乘船寻访珍稀长鼻猴、观赏壮丽婆罗洲海滩日落、享用自助晚餐与夜游梦幻萤火虫。', alternates: { en: '/tours/firefly-safari/', zh: '/zh-hans/tours/firefly-safari/', ko: '/ko/tours/firefly-safari/' } },
  '/ko/tours/firefly-safari/': { lang: 'ko', title: '코타키나발루 반딧불 투어 & 맹그로브 리버 크루즈 | 일몰과 반딧불이 - KKfootprint', description: '코타키나발루 야생동물 & 반딧불이 투어: 맹그로브 강 크루즈, 코주부 원숭이 관찰, 보르네오 선셋, 뷔페 저녁 식사 및 반딧불이 감상.', alternates: { en: '/tours/firefly-safari/', zh: '/zh-hans/tours/firefly-safari/', ko: '/ko/tours/firefly-safari/' } },

  // Mari-Mari Cultural Village
  '/tours/mari-mari-cultural-village/': { lang: 'en', title: 'Mari-Mari Cultural Village Tour from Kota Kinabalu | KKfootprint Travel', description: 'Experience Sabah culture at Mari-Mari Cultural Village with traditional longhouses, demonstrations and a cultural meal.', alternates: { en: '/tours/mari-mari-cultural-village/', zh: '/zh-hans/tours/mari-mari-cultural-village/', ko: '/ko/tours/mari-mari-cultural-village/' } },
  '/zh-hans/tours/mari-mari-cultural-village/': { lang: 'zh-Hans', title: '亚庇马里马里文化村一日游 | 沙巴原住民原生态文化体验 - KKfootprint', description: '走进沙巴五大原住民族传统长屋：亲身体验吹箭、传统取火、品尝土著美食与欣赏传统原住民舞蹈表演。', alternates: { en: '/tours/mari-mari-cultural-village/', zh: '/zh-hans/tours/mari-mari-cultural-village/', ko: '/ko/tours/mari-mari-cultural-village/' } },
  '/ko/tours/mari-mari-cultural-village/': { lang: 'ko', title: '코타키나발루 마리마리 민속마을 투어 | 사바 전통 문화 체험 - KKfootprint', description: '사바 주 5대 원주민 전통 부족 마을 탐방: 전통 롱하우스 방문, 블로우파이프 사냥 체험, 전통 음식 시식 및 문화 공연 관람.', alternates: { en: '/tours/mari-mari-cultural-village/', zh: '/zh-hans/tours/mari-mari-cultural-village/', ko: '/ko/tours/mari-mari-cultural-village/' } },
};
const PAYMENT_PAGE_PATHS = new Set(['/payment/', '/payment']);
const LANDING_PAGE_SEO = {
  '/en/': {
    lang: 'en',
    title: 'Kota Kinabalu Tour Packages | KKfootprint Travel Sabah',
    description: 'Explore Kota Kinabalu and Sabah with local driver-guides. Compare island hopping, Kundasang, Mengalum Island, firefly, city and private tours.',
  },
  '/zh-hans/': {
    lang: 'zh-Hans',
    title: '亚庇沙巴旅游配套 | KKfootprint Travel',
    description: '探索亚庇与沙巴：跳岛游、孟加伦岛、神山昆达山、萤火虫、市区游和私人包车。提供中文/英语向导服务。',
  },
  '/ko/': {
    lang: 'ko',
    title: '코타키나발루 사바 투어 | KKfootprint Travel',
    description: '코타키나발루와 사바의 섬 호핑, 멩갈룸 섬, 쿤다상, 반딧불이, 시티투어 및 프라이빗 투어를 알아보세요.',
  },
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Legacy Google Ads and external link compatibility redirect for Mengalum Island tour.
    const mengalumMatch = url.pathname.match(/^(?:\/(en|zh-hans|ko))?\/mengalum\/tour\/?$/i);
    if (mengalumMatch) {
      const lang = mengalumMatch[1];
      const targetPath = lang ? `/${lang}/tours/mengalum-island/` : '/tours/mengalum-island/';
      const targetUrl = new URL(targetPath, 'https://kkfootprint.com');
      targetUrl.search = url.search;
      return Response.redirect(targetUrl.toString(), 301);
    }

    // Keep one public address for customers and search engines.
    if (url.hostname === 'www.kkfootprint.com') {
      url.hostname = 'kkfootprint.com';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/') {
      return Response.redirect(new URL('/en/', url), 301);
    }

    if (['/en', '/zh-hans', '/ko'].includes(url.pathname)) {
      return Response.redirect(new URL(`${url.pathname}/`, url), 301);
    }

    if (['/en/', '/zh-hans/', '/ko/'].includes(url.pathname)) {
      const asset = await env.ASSETS.fetch(new Request(new URL('/', url), request));
      return applyLandingPageSeo(asset, url, LANDING_PAGE_SEO[url.pathname]);
    }

    // Canonicalize legacy /en/tours/* requests to canonical /tours/*
    if (url.pathname === '/en/tours' || url.pathname.startsWith('/en/tours/')) {
      const targetPath = url.pathname.replace(/^\/en/, '');
      const normalizedPath = targetPath.endsWith('/') ? targetPath : `${targetPath}/`;
      const targetUrl = new URL(normalizedPath, 'https://kkfootprint.com');
      targetUrl.search = url.search;
      return Response.redirect(targetUrl.toString(), 301);
    }

    const isGetOrHead = request.method === 'GET' || request.method === 'HEAD';

    if (isGetOrHead && !url.pathname.endsWith('/') && TOUR_DETAIL_PATHS.has(`${url.pathname}/`)) {
      return Response.redirect(new URL(`${url.pathname}/`, url), 301);
    }

    if (isGetOrHead && TOUR_DETAIL_PATHS.has(url.pathname)) {
      // Cloudflare Assets canonicalizes /tour.html to /tour with a 307. Fetch
      // the canonical asset name directly so the visitor's detail-page URL is
      // retained and the client can select the matching package from its path.
      const asset = await env.ASSETS.fetch(new Request(new URL('/tour', url), request));
      return applyTourSeo(asset, url, TOUR_DETAIL_SEO[url.pathname]);
    }

    // Deposit proof is intentionally a separate, private flow. It is not part
    // of browsing or submitting a tour enquiry.
    if (request.method === 'GET' && PAYMENT_PAGE_PATHS.has(url.pathname)) {
      return env.ASSETS.fetch(new Request(new URL('/payment', url), request));
    }

    // Redirect language-prefixed /admin URLs to the canonical protected admin route
    if (url.pathname === '/en/admin' || url.pathname === '/zh-hans/admin' || url.pathname === '/ko/admin' ||
        url.pathname === '/en/admin/' || url.pathname === '/zh-hans/admin/' || url.pathname === '/ko/admin/') {
      return Response.redirect(`https://${url.host}/admin`, 301);
    }

    // The admin dashboard is intentionally available only on the custom domain.
    // Cloudflare Access is configured in front of this route; never expose the
    // customer-record endpoint from the workers.dev development hostname.
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      if (!isCustomAdminHost(url)) return new Response('Not found.', { status: 404 });
      return env.ASSETS.fetch(new Request(new URL('/admin', url), request));
    }

    // Media previews are private, expiring review pages for the owner. Their
    // source video is kept in a dedicated R2 bucket and is never publicly
    // listed or indexed.
    if (request.method === 'GET' && /^\/media-preview\/[0-9a-f-]{36}\/?$/i.test(url.pathname)) {
      return handleMediaDraftPreviewPage(request, env, url);
    }

    if (url.pathname.startsWith('/api/rex/media-drafts/')) {
      return handleMediaDraftRequest(request, env, url);
    }

    if (url.pathname === '/api/rex/admin/conversations') {
      return handleAdminConversations(request, env, url);
    }

    if (url.pathname === '/api/rex/admin/reply') {
      return handleAdminStaffReply(request, env);
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

    if (url.pathname === '/api/rex/payment-intent') {
      return handlePaymentIntent(request, env, url);
    }

    if (url.pathname === '/api/rex/payment-receipts') {
      return handlePaymentReceiptUpload(request, env);
    }

    if (url.pathname.startsWith('/api/rex/payment-receipts/')) {
      return handlePaymentReceiptReview(request, env, url);
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

      const catalog = await getAuthoritativeTourCatalog(request, env);
      const booking = normalizeBooking(requestBody, catalog);
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

      const upstreamBody = await upstreamResponse.json().catch(() => ({}));
      return jsonResponse(
        {
          ok: true,
          requestId,
          bookingReference: normalizeUpstreamText(upstreamBody.bookingReference, 48),
          status: normalizeUpstreamText(upstreamBody.status, 48) || 'pending_availability',
          message: 'Your booking request has been received. We will confirm availability before requesting payment.',
        },
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

function applyTourSeo(response, url, seo) {
  if (!seo || !response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;
  const alternates = seo.alternates || {};
  return new HTMLRewriter()
    .on('html', { element(element) { element.setAttribute('lang', seo.lang || 'en'); } })
    .on('title', { element(element) { element.setInnerContent(seo.title); } })
    .on('#tourDescription', { element(element) { element.setAttribute('content', seo.description); } })
    .on('#tourCanonical', { element(element) { element.setAttribute('href', `https://kkfootprint.com${url.pathname}`); } })
    .on('#tourAlternateEn', { element(element) { element.setAttribute('href', `https://kkfootprint.com${alternates.en || url.pathname}`); } })
    .on('#tourAlternateZh', { element(element) { element.setAttribute('href', `https://kkfootprint.com${alternates.zh || url.pathname}`); } })
    .on('#tourAlternateKo', { element(element) { element.setAttribute('href', `https://kkfootprint.com${alternates.ko || url.pathname}`); } })
    .on('#tourAlternateDefault', { element(element) { element.setAttribute('href', `https://kkfootprint.com${alternates.en || url.pathname}`); } })
    .transform(response);
}

function applyLandingPageSeo(response, url, seo) {
  if (!seo || !response.ok || !response.headers.get('content-type')?.includes('text/html')) return response;
  const canonical = `https://kkfootprint.com${url.pathname}`;
  return new HTMLRewriter()
    .on('html', { element(element) { element.setAttribute('lang', seo.lang); } })
    .on('title', { element(element) { element.setInnerContent(seo.title); } })
    .on('meta[name="description"]', { element(element) { element.setAttribute('content', seo.description); } })
    .on('#canonicalUrl', { element(element) { element.setAttribute('href', canonical); } })
    .on('#ogTitle', { element(element) { element.setAttribute('content', seo.title); } })
    .on('#ogDescription', { element(element) { element.setAttribute('content', seo.description); } })
    .on('#ogUrl', { element(element) { element.setAttribute('content', canonical); } })
    .on('#twitterTitle', { element(element) { element.setAttribute('content', seo.title); } })
    .on('#twitterDescription', { element(element) { element.setAttribute('content', seo.description); } })
    .transform(response);
}

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
    if (env.TURNSTILE_PROTECT_CHAT === 'true') {
      await verifyTurnstileIfEnabled(turnstileToken, request, env);
    }

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
    if (env.TURNSTILE_PROTECT_CHAT === 'true') {
      await verifyTurnstileIfEnabled(turnstileToken, request, env);
    }

    const chatMessage = {
      conversationId: normalizeRequiredSingleLine(body.conversationId, 160, 'conversation'),
      message: normalizeOptionalMultiline(body.message, 2000),
      language: normalizeLanguage(body.language),
      channel: normalizeCustomerChannel(body.channel),
      pageContext: normalizePageContext(body.pageContext),
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

async function handleAdminConversations(request, env, url) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'GET' });
  }
  if (!isCustomAdminHost(url)) {
    return jsonResponse({ error: 'not_found', message: 'Not found.' }, 404);
  }

  try {
    const origin = request.headers.get('Origin');
    if (origin) validateOrigin(request, env);
    const conversationKey = normalizeOptionalSingleLine(url.searchParams.get('conversation'), 160);
    const mode = conversationKey ? 'detail' : 'list';
    const forwarded = await forwardSignedPayload(request, env, 'admin_conversation_dashboard', {
      adminDashboard: { mode, conversationKey },
    });
    return jsonResponse({ ok: true, ...(forwarded.body || {}) }, 200);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function handleAdminStaffReply(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }
  if (!isCustomAdminHost(new URL(request.url))) {
    return jsonResponse({ error: 'not_found', message: 'Not found.' }, 404);
  }

  try {
    validateSameOriginFetch(request, env);
    ensureJsonContentType(request);
    const body = await readJsonBody(request, getMaxPayloadBytes(env));
    validateFields(body, ADMIN_STAFF_REPLY_FIELDS);
    const adminStaffReply = {
      conversationKey: normalizeRequiredSingleLine(body.conversationId, 160, 'conversation'),
      message: normalizeOptionalMultiline(body.message, 1600),
    };
    if (!adminStaffReply.message) throw new HttpError(400, 'invalid_field', 'Please enter a reply.');

    const forwarded = await forwardSignedPayload(request, env, 'admin_staff_reply', { adminStaffReply });
    const reply = normalizeUpstreamText(forwarded.body?.reply, 4000);
    return jsonResponse({
      ok: true,
      requestId: forwarded.requestId,
      status: normalizeUpstreamText(forwarded.body?.status, 32) || 'sent',
      reply,
    }, 200);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function handlePaymentReceiptUpload(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }

  try {
    validateOrigin(request, env);
    ensureMultipartContentType(request);
    if (!env.PAYMENT_RECEIPTS) {
      throw new HttpError(500, 'service_misconfigured', 'Receipt storage is not configured.');
    }

    const declaredLength = Number(request.headers.get('Content-Length'));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_RECEIPT_BYTES + 16 * 1024) {
      throw new HttpError(413, 'payload_too_large', 'Receipt files must be 15 MB or smaller.');
    }

    const form = await request.formData();
    const turnstileToken = normalizeOptionalSingleLine(form.get('turnstileToken'), 4096);
    await verifyTurnstileIfEnabled(turnstileToken, request, env);
    const bookingReference = normalizeBookingReference(form.get('bookingReference'));
    const name = normalizeRequiredSingleLine(form.get('name'), 160, 'name');
    const email = normalizeRequiredEmail(form.get('email'));
    const receipt = form.get('receipt');
    const eligibility = await forwardSignedPayload(request, env, 'website_payment_receipt_preflight', { receiptPreflight: { bookingReference } });
    if (eligibility.body?.eligible !== true) {
      throw new HttpError(409, 'receipt_not_available', normalizeUpstreamText(eligibility.body?.message, 240) || 'Payment is not available yet because this booking is still waiting for availability approval.');
    }
    if (!(receipt instanceof File) || receipt.size === 0) {
      throw new HttpError(400, 'invalid_receipt', 'Please choose a receipt image or PDF.');
    }
    if (receipt.size > MAX_RECEIPT_BYTES) {
      throw new HttpError(413, 'payload_too_large', 'Receipt files must be 15 MB or smaller.');
    }
    const extension = RECEIPT_FILE_TYPES.get(receipt.type.toLowerCase());
    if (!extension) {
      throw new HttpError(415, 'unsupported_media_type', 'Use a JPG, PNG, or PDF receipt.');
    }

    const receiptId = crypto.randomUUID();
    const reviewToken = createSecureToken();
    const expiresAt = new Date(Date.now() + RECEIPT_REVIEW_TTL_MS).toISOString();
    const objectKey = `payment-receipts/${bookingReference}/${receiptId}.${extension}`;
    const reviewUrl = new URL(`/api/rex/payment-receipts/${encodeURIComponent(bookingReference)}/${receiptId}.${extension}`, request.url);
    reviewUrl.searchParams.set('token', reviewToken);

    await env.PAYMENT_RECEIPTS.put(objectKey, receipt.stream(), {
      httpMetadata: {
        contentType: receipt.type,
        contentDisposition: `attachment; filename="${safeReceiptFilename(receipt.name, extension)}"`,
      },
      customMetadata: {
        receiptId,
        bookingReference,
        reviewToken,
        expiresAt,
        customerName: name,
        customerEmail: email,
      },
    });

    try {
      await forwardSignedPayload(request, env, 'website_payment_receipt', {
        receipt: {
          receiptId,
          bookingReference,
          customerName: name,
          customerEmail: email,
          objectKey,
          filename: safeReceiptFilename(receipt.name, extension),
          contentType: receipt.type,
          size: receipt.size,
          reviewUrl: reviewUrl.toString(),
          reviewExpiresAt: expiresAt,
        },
      });
    } catch (error) {
      await env.PAYMENT_RECEIPTS.delete(objectKey);
      throw error;
    }

    return jsonResponse({ ok: true, receiptId, bookingReference, message: 'Receipt received. We will verify the payment shortly.' }, 202);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function handlePaymentIntent(request, env, url) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'GET' });
  }

  try {
    validateSameOriginFetch(request, env);
    const bookingReference = normalizeBookingReference(url.searchParams.get('ref'));
    const eligibility = await forwardSignedPayload(request, env, 'website_payment_receipt_preflight', {
      receiptPreflight: { bookingReference },
    });
    const amount = Number(eligibility.body?.depositRequired);
    const language = normalizeLanguage(eligibility.body?.language);

    if (eligibility.body?.eligible !== true || !Number.isFinite(amount) || amount <= 0 || amount >= 100000) {
      throw new HttpError(
        409,
        'payment_not_available',
        normalizeUpstreamText(eligibility.body?.message, 240)
          || 'Payment is not available for this booking yet. Please wait for REX to send payment instructions.',
      );
    }

    return jsonResponse({
      ok: true,
      bookingReference,
      depositRequired: Number(amount.toFixed(2)),
      language,
      message: normalizeUpstreamText(eligibility.body?.message, 240) || 'Approved deposit payment is available.',
    }, 200);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function handlePaymentReceiptReview(request, env, url) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'GET' });
  }
  try {
    if (!env.PAYMENT_RECEIPTS) throw new HttpError(404, 'not_found', 'Receipt not found.');
    const match = /^\/api\/rex\/payment-receipts\/([^/]+)\/([0-9a-f-]{36})\.(jpg|png|pdf)$/i.exec(url.pathname);
    if (!match) throw new HttpError(404, 'not_found', 'Receipt not found.');
    const bookingReference = normalizeBookingReference(decodeURIComponent(match[1]));
    const receiptId = match[2].toLowerCase();
    const extension = match[3].toLowerCase();
    const objectKey = `payment-receipts/${bookingReference}/${receiptId}.${extension}`;
    const object = await env.PAYMENT_RECEIPTS.get(objectKey);
    const token = url.searchParams.get('token') || '';
    const metadata = object?.customMetadata || {};
    if (!object || !timingSafeTokenEqual(token, metadata.reviewToken || '') || Date.parse(metadata.expiresAt || '') < Date.now()) {
      throw new HttpError(404, 'not_found', 'Receipt not found or review link expired.');
    }
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Disposition': object.httpMetadata?.contentDisposition || 'attachment',
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ error: error.code, message: error.message }, error.status);
    console.error('Unexpected payment receipt review error', { name: error?.name, message: error?.message });
    return jsonResponse({ error: 'service_unavailable', message: 'Receipt could not be opened.' }, 502);
  }
}

async function handleMediaDraftPreviewPage(request, env, url) {
  if (!isCustomAdminHost(url)) return new Response('Not found.', { status: 404 });
  const asset = await env.ASSETS.fetch(new Request(new URL('/media-preview', url), request));
  if (!asset.ok) return asset;
  return withPrivatePreviewHeaders(asset);
}

async function handleMediaDraftRequest(request, env, url) {
  try {
    if (!isCustomAdminHost(url)) throw new HttpError(404, 'not_found', 'Draft not found.');
    if (!env.REX_MEDIA_DRAFTS) throw new HttpError(404, 'not_found', 'Draft not found.');

    const match = /^\/api\/rex\/media-drafts\/([0-9a-f-]{36})\/(metadata|video|decision)$/i.exec(url.pathname);
    if (!match) throw new HttpError(404, 'not_found', 'Draft not found.');
    const draftId = normalizeMediaDraftId(match[1]);
    const action = match[2].toLowerCase();

    if (action === 'decision') return handleMediaDraftDecision(request, env, url, draftId);
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'GET' });
    }

    const draft = await getAuthorizedMediaDraft(request, env, draftId, url.searchParams.get('token') || '');
    if (action === 'metadata') return jsonResponse({ ok: true, draft: toPublicMediaDraft(draft.metadata) }, 200);
    return streamAuthorizedMediaDraftVideo(request, env, draft.metadata);
  } catch (error) {
    if (error instanceof HttpError) return jsonResponse({ error: error.code, message: error.message }, error.status);
    console.error('Unexpected media draft request error', { name: error?.name, message: error?.message });
    return jsonResponse({ error: 'service_unavailable', message: 'Draft could not be opened.' }, 502);
  }
}

async function handleMediaDraftDecision(request, env, url, draftId) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed', message: 'Method not allowed.' }, 405, { Allow: 'POST' });
  }
  try {
    validateSameOriginFetch(request, env);
    ensureJsonContentType(request);
    const body = await readJsonBody(request, getMaxPayloadBytes(env));
    validateFields(body, new Set(['token', 'action', 'note']));
    const token = normalizeRequiredSingleLine(body.token, 128, 'preview token');
    const draft = await getAuthorizedMediaDraft(request, env, draftId, token);
    const decision = normalizeMediaDraftDecision(body.action);
    const note = normalizeOptionalMultiline(body.note, 800);
    const forwarded = await forwardSignedMediaDraftDecision(request, env, {
      draftId,
      token,
      videoUrl: `https://kkfootprint.com/api/rex/media-drafts/${draftId}/video?token=${encodeURIComponent(token)}`,
      decision,
      note,
      draft: toPublicMediaDraft(draft.metadata),
    });
    return jsonResponse({
      ok: true,
      draftId,
      status: normalizeUpstreamText(forwarded.body?.status, 48) || 'received',
      message: normalizeUpstreamText(forwarded.body?.message, 240) || 'REX received your draft decision.',
    }, 202);
  } catch (error) {
    return handleRequestError(error);
  }
}

async function getAuthorizedMediaDraft(request, env, draftId, token) {
  const objectKey = `${MEDIA_DRAFT_PREFIX}${draftId}/metadata.json`;
  const object = await env.REX_MEDIA_DRAFTS.get(objectKey);
  if (!object) throw new HttpError(404, 'not_found', 'Draft not found or preview link expired.');
  const metadata = normalizeMediaDraftMetadata(await object.json().catch(() => null), draftId);
  if (!timingSafeTokenEqual(token, metadata.previewToken) || Date.parse(metadata.expiresAt) < Date.now()) {
    throw new HttpError(404, 'not_found', 'Draft not found or preview link expired.');
  }
  return { object, metadata };
}

async function streamAuthorizedMediaDraftVideo(request, env, metadata) {
  const objectKey = `${MEDIA_DRAFT_PREFIX}${metadata.draftId}/video.mp4`;
  const rangeHeader = request.headers.get('Range');
  // R2 accepts the request Headers as its range input. Passing the raw string is
  // not a supported R2 range type and causes playback/seeking failures.
  const video = await env.REX_MEDIA_DRAFTS.get(objectKey, rangeHeader ? { range: request.headers } : undefined);
  if (!video) throw new HttpError(404, 'not_found', 'Draft video not found.');
  const headers = new Headers({
    'Content-Type': video.httpMetadata?.contentType || 'video/mp4',
    'Cache-Control': 'private, no-store, max-age=0',
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  });
  if (video.size) headers.set('Content-Length', String(video.size));
  if (video.range) {
    const start = video.range.offset;
    const end = start + video.range.length - 1;
    // The returned object's size is the complete object size, while range
    // describes the requested subset.
    headers.set('Content-Range', `bytes ${start}-${end}/${video.size}`);
    headers.set('Content-Length', String(video.range.length));
    return new Response(video.body, { status: 206, headers });
  }
  return new Response(video.body, { headers });
}

function normalizeMediaDraftMetadata(value, expectedDraftId) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(404, 'not_found', 'Draft not found.');
  const draftId = normalizeMediaDraftId(value.draftId);
  if (draftId !== expectedDraftId) throw new HttpError(404, 'not_found', 'Draft not found.');
  const previewToken = normalizeRequiredSingleLine(value.previewToken, 128, 'preview token');
  const expiresAt = normalizeRequiredSingleLine(value.expiresAt, 40, 'expiry');
  const expiry = Date.parse(expiresAt);
  if (!Number.isFinite(expiry) || expiry <= Date.now() - MEDIA_DRAFT_MAX_TTL_MS || expiry > Date.now() + MEDIA_DRAFT_MAX_TTL_MS) {
    throw new HttpError(404, 'not_found', 'Draft not found or preview link expired.');
  }
  const platforms = Array.isArray(value.platforms)
    ? value.platforms.map((platform) => normalizeOptionalSingleLine(platform, 32)).filter(Boolean).slice(0, 4)
    : [];
  const hashtags = Array.isArray(value.hashtags)
    ? value.hashtags.map((tag) => normalizeOptionalSingleLine(tag, 80).replace(/^#?/, '#')).filter((tag) => /^#[\p{L}\p{N}_-]{1,79}$/u.test(tag)).slice(0, 30)
    : [];
  return {
    draftId,
    previewToken,
    expiresAt: new Date(expiry).toISOString(),
    title: normalizeRequiredSingleLine(value.title, 160, 'title'),
    audience: normalizeOptionalSingleLine(value.audience, 80),
    language: normalizeLanguage(value.language),
    style: normalizeOptionalSingleLine(value.style, 120),
    platforms,
    scheduledFor: normalizeOptionalSingleLine(value.scheduledFor, 40),
    caption: normalizeOptionalMultiline(value.caption, 3000),
    hashtags,
    landingPageUrl: normalizeSafePublicUrl(value.landingPageUrl),
    musicCredit: normalizeOptionalSingleLine(value.musicCredit, 160),
  };
}

function toPublicMediaDraft(metadata) {
  return {
    draftId: metadata.draftId,
    expiresAt: metadata.expiresAt,
    title: metadata.title,
    audience: metadata.audience,
    language: metadata.language,
    style: metadata.style,
    platforms: metadata.platforms,
    scheduledFor: metadata.scheduledFor,
    caption: metadata.caption,
    hashtags: metadata.hashtags,
    landingPageUrl: metadata.landingPageUrl,
    musicCredit: metadata.musicCredit,
  };
}

function normalizeMediaDraftId(value) {
  const id = normalizeRequiredSingleLine(value, 36, 'draft ID').toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)) {
    throw new HttpError(404, 'not_found', 'Draft not found.');
  }
  return id;
}

function normalizeMediaDraftDecision(value) {
  const decision = normalizeRequiredSingleLine(value, 24, 'draft decision').toLowerCase();
  if (!['approve', 'revise', 'regenerate', 'cancel'].includes(decision)) {
    throw new HttpError(400, 'invalid_field', 'Please choose a valid draft decision.');
  }
  return decision;
}

function normalizeSafePublicUrl(value) {
  const candidate = normalizeOptionalSingleLine(value, 500);
  if (!candidate) return '';
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:' || (url.hostname !== 'kkfootprint.com' && url.hostname !== 'www.kkfootprint.com')) throw new Error('invalid');
    return url.toString();
  } catch {
    throw new HttpError(400, 'invalid_field', 'Invalid landing page link.');
  }
}

function withPrivatePreviewHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store, max-age=0');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
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

async function forwardSignedMediaDraftDecision(request, env, content) {
  if (!env.N8N_MEDIA_WEBHOOK_URL || !env.REX_MEDIA_WEBHOOK_KEY) {
    throw new HttpError(500, 'service_misconfigured', 'Media approval is not configured yet.');
  }
  let webhookUrl;
  try {
    webhookUrl = new URL(env.N8N_MEDIA_WEBHOOK_URL);
    if (webhookUrl.protocol !== 'https:') throw new Error('HTTPS required');
  } catch {
    throw new HttpError(500, 'service_misconfigured', 'Media approval is not configured yet.');
  }
  const requestId = crypto.randomUUID();
  const receivedAt = new Date().toISOString();
  const payload = JSON.stringify({ requestId, receivedAt, source: 'rex_media_draft_decision', ...content });
  const signature = await createHmacSignature(env.REX_CUSTOMER_HMAC_SECRET, receivedAt, payload);
  const response = await fetch(webhookUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-REX-Timestamp': receivedAt,
      'X-REX-Signature': signature,
      'X-REX-Request-Id': requestId,
      'X-REX-Media-Key': env.REX_MEDIA_WEBHOOK_KEY,
    },
    body: payload,
  });
  if (!response.ok) {
    console.error('n8n media decision returned a non-success status', { requestId, status: response.status });
    throw new HttpError(502, 'upstream_unavailable', 'REX could not save your decision. Please try again.');
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

function isCustomAdminHost(url) {
  return url.hostname === 'kkfootprint.com' || url.hostname === 'www.kkfootprint.com';
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

function validateSameOriginFetch(request, env) {
  const origin = request.headers.get('Origin');
  if (origin) {
    validateOrigin(request, env);
    return;
  }
  if (request.headers.get('Sec-Fetch-Site') === 'same-origin') return;
  throw new HttpError(403, 'origin_not_allowed', 'This request is not allowed.');
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

function ensureMultipartContentType(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().startsWith('multipart/form-data;')) {
    throw new HttpError(415, 'unsupported_media_type', 'A receipt upload is required.');
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

function normalizeBooking(data, catalog) {
  const requestedTour = normalizeRequiredSingleLine(data.tour, 240, 'tour');
  const tourIds = normalizeTourIds(requestedTour, catalog);
  const adults = normalizeInteger(data.adults, 1, 100, 'adults');
  const children = normalizeInteger(data.children, 0, 100, 'children');
  const pricingSnapshot = createPricingSnapshot(catalog, tourIds, adults, children);
  return {
    name: normalizeRequiredSingleLine(data.name, 160, 'name'),
    contact: normalizeTelegram(data.contact),
    email: normalizeRequiredEmail(data.email),
    tour: pricingSnapshot.tourName,
    tourId: tourIds.length === 1 ? tourIds[0] : 'combo',
    tourIds,
    date: normalizeOptionalSingleLine(data.date, 64),
    hotel: normalizeOptionalSingleLine(data.hotel, 300),
    adults,
    children,
    type: normalizeOptionalSingleLine(data.type, 40),
    vehicle: normalizeOptionalSingleLine(data.vehicle, 80),
    requests: normalizeOptionalMultiline(data.requests, 2000),
    pricingSnapshot,
  };
}

async function getAuthoritativeTourCatalog(request, env) {
  const assetUrl = new URL('/data/tours.js', request.url);
  const response = await env.ASSETS.fetch(new Request(assetUrl));
  if (!response.ok) throw new HttpError(500, 'service_misconfigured', 'Pricing is not configured.');
  const source = await response.text();
  const match = /KKF_TOUR_CATALOG_JSON:(\{[\s\S]*?\})\s*\*\//.exec(source);
  if (!match) throw new HttpError(500, 'service_misconfigured', 'Pricing is not configured.');
  try {
    const catalog = JSON.parse(match[1]);
    if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) throw new Error('Invalid catalog');
    return catalog;
  } catch {
    throw new HttpError(500, 'service_misconfigured', 'Pricing is not configured.');
  }
}

function normalizeTourIds(value, catalog) {
  const raw = Array.isArray(value)
    ? value
    : String(value || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (raw.length === 0) {
    throw new HttpError(400, 'invalid_field', 'Please choose a valid tour package.');
  }
  if (raw.includes('custom') || (raw.length === 1 && raw[0] === 'custom')) {
    return ['custom'];
  }
  const validIds = [];
  for (const item of raw) {
    const key = String(item).trim().toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(catalog, key)) {
      throw new HttpError(400, 'invalid_field', 'Please choose a valid tour package.');
    }
    if (!validIds.includes(key)) validIds.push(key);
  }
  return validIds;
}

function createPricingSnapshot(catalog, tourIds, adults, children) {
  if (tourIds.length === 1 && tourIds[0] === 'custom') {
    return {
      catalogueReference: 'data/tours.js',
      createdAt: new Date().toISOString(),
      currency: 'MYR',
      tourId: 'custom',
      tourIds: ['custom'],
      tourName: 'Custom Multi-Tour Package',
      adultRate: null,
      childRate: null,
      adults,
      children,
      basePrice: 0,
      addonsTotal: 0,
      approvedDiscount: 0,
      quotedTotal: null,
      depositRequired: null,
      balanceDue: null,
      paymentPlan: 'CUSTOM_QUOTE_PENDING',
      quoteEligible: false,
    };
  }

  if (tourIds.length === 1) {
    const tourId = tourIds[0];
    const tour = catalog[tourId];
    const adultRate = Number(tour?.adult);
    const childRate = tour?.child === null ? null : Number(tour?.child);
    if (!Number.isFinite(adultRate) || adultRate < 0 || (childRate !== null && (!Number.isFinite(childRate) || childRate < 0))) {
      throw new HttpError(500, 'service_misconfigured', 'Pricing is not configured.');
    }
    const childPriceConfirmed = children === 0 || childRate !== null;
    const basePrice = adultRate * adults + (childPriceConfirmed ? childRate * children : 0);
    const quotedTotal = childPriceConfirmed ? basePrice : null;
    // Mengalum currently uses the owner-approved Ria arrangement only. Its
    // advance covers the committed RM130 cost for each paying guest; extras are
    // never included unless staff adds and confirms them separately.
    const riaAdvanceRequired = tourId === 'mengalum'
      ? Number((130 * (adults + children)).toFixed(2))
      : null;
    const standardDeposit = quotedTotal === null ? null : Number((quotedTotal * 0.5).toFixed(2));
    return {
      catalogueReference: 'data/tours.js',
      createdAt: new Date().toISOString(),
      currency: 'MYR',
      tourId,
      tourIds: [tourId],
      tourName: normalizeOptionalSingleLine(tour?.name, 160) || tourId,
      adultRate,
      childRate,
      adults,
      children,
      basePrice,
      addonsTotal: 0,
      approvedDiscount: 0,
      quotedTotal,
      depositRequired: riaAdvanceRequired ?? standardDeposit,
      balanceDue: quotedTotal === null ? null : Number((quotedTotal - (riaAdvanceRequired ?? standardDeposit ?? 0)).toFixed(2)),
      paymentPlan: riaAdvanceRequired !== null ? 'RIA_COST_COVERING_ADVANCE' : 'STANDARD_DEPOSIT',
      quoteEligible: childPriceConfirmed,
    };
  }

  // Multi-tour combo pricing calculation
  const tours = tourIds.map((id) => catalog[id]);
  let totalAdultRate = 0;
  let totalChildRate = 0;
  let anyChildNull = false;
  const tourNames = [];
  let mengalumIncluded = false;

  for (let i = 0; i < tourIds.length; i += 1) {
    const id = tourIds[i];
    const tour = tours[i];
    const adultRate = Number(tour?.adult);
    const childRate = tour?.child === null ? null : Number(tour?.child);
    if (!Number.isFinite(adultRate) || adultRate < 0 || (childRate !== null && (!Number.isFinite(childRate) || childRate < 0))) {
      throw new HttpError(500, 'service_misconfigured', 'Pricing is not configured.');
    }
    totalAdultRate += adultRate;
    if (childRate === null) {
      anyChildNull = true;
    } else {
      totalChildRate += childRate;
    }
    tourNames.push(normalizeOptionalSingleLine(tour?.name, 160) || id);
    if (id === 'mengalum') mengalumIncluded = true;
  }

  const childPriceConfirmed = children === 0 || !anyChildNull;
  const basePrice = totalAdultRate * adults + (childPriceConfirmed ? totalChildRate * children : 0);
  const quotedTotal = childPriceConfirmed ? basePrice : null;

  let depositRequired = null;
  if (quotedTotal !== null) {
    if (mengalumIncluded) {
      const riaAdvance = Number((130 * (adults + children)).toFixed(2));
      const mengalumTour = catalog.mengalum;
      const mengalumTotal = (Number(mengalumTour.adult) * adults) + (Number(mengalumTour.child || 0) * children);
      const otherToursTotal = Math.max(0, quotedTotal - mengalumTotal);
      depositRequired = Number((riaAdvance + (otherToursTotal * 0.5)).toFixed(2));
    } else {
      depositRequired = Number((quotedTotal * 0.5).toFixed(2));
    }
  }

  return {
    catalogueReference: 'data/tours.js',
    createdAt: new Date().toISOString(),
    currency: 'MYR',
    tourId: 'combo',
    tourIds,
    tourName: tourNames.join(' + '),
    adultRate: totalAdultRate,
    childRate: anyChildNull ? null : totalChildRate,
    adults,
    children,
    basePrice,
    addonsTotal: 0,
    approvedDiscount: 0,
    quotedTotal,
    depositRequired,
    balanceDue: quotedTotal === null || depositRequired === null ? null : Number((quotedTotal - depositRequired).toFixed(2)),
    paymentPlan: mengalumIncluded ? 'RIA_COMBO_ADVANCE' : 'STANDARD_DEPOSIT',
    quoteEligible: childPriceConfirmed,
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
  const raw = normalizeOptionalSingleLine(value, 33);
  if (!raw) return '';
  const username = raw.replace(/^@?/, '@');
  if (!/^@[A-Za-z0-9_]{5,32}$/.test(username)) {
    throw new HttpError(400, 'invalid_field', 'Please provide a valid Telegram username.');
  }
  return username;
}

function normalizePageContext(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return {
    path: normalizeOptionalSingleLine(value.path, 240),
    title: normalizeOptionalSingleLine(value.title, 160),
    language: normalizeLanguage(value.language),
    selectedTour: normalizeOptionalSingleLine(value.selectedTour, 160),
    bookingReference: normalizeOptionalSingleLine(value.bookingReference, 96),
  };
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

function normalizeBookingReference(value) {
  const reference = normalizeRequiredSingleLine(value, 96, 'booking reference').toUpperCase();
  if (!/^(?:KKF|DEV)-[A-Z0-9][A-Z0-9-]{2,92}$/.test(reference)) {
    throw new HttpError(400, 'invalid_field', 'Please provide a valid booking reference.');
  }
  return reference;
}

function safeReceiptFilename(value, extension) {
  const base = String(value || 'receipt')
    .replace(/\.[^.]+$/, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'receipt';
  return `${base}.${extension}`;
}

function createSecureToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function timingSafeTokenEqual(first, second) {
  if (typeof first !== 'string' || typeof second !== 'string' || first.length !== second.length || first.length < 32) return false;
  let difference = 0;
  for (let index = 0; index < first.length; index += 1) difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  return difference === 0;
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
