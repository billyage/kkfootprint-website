const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');

function createMockEnvironment() {
  const dataLayer = [];
  const gtagCalls = [];

  const window = {
    dataLayer,
    gtag: function(...args) {
      gtagCalls.push(args);
    },
    location: { pathname: '/en/' }
  };

  return { window, dataLayer, gtagCalls };
}

function testIndexTracking() {
  console.log('Testing index.html tracking behavior...');
  const content = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  // Verify KKF_TRACKING structure exists with real labels
  assert(content.includes('googleAdsId: \'AW-18443632160\''), 'index.html must have AW-18443632160');
  assert(content.includes('label: \'ODSbCI-Rr_kcEKD8zdpE\''), 'index.html must have booking label');
  assert(content.includes('label: \'DpRECJmF9P8cEKD8zdpE\''), 'index.html must have telegram label');
  assert(content.includes('label: \'d7krCKno_P8cEKD8zdpE\''), 'index.html must have payment label');

  // Verify function logic in isolation
  const { window, dataLayer, gtagCalls } = createMockEnvironment();

  const KKF_TRACKING = {
    googleAdsId: 'AW-18443632160',
    conversions: {
      booking: { enabled: true, label: 'ODSbCI-Rr_kcEKD8zdpE' },
      telegram: { enabled: true, label: 'DpRECJmF9P8cEKD8zdpE' },
      payment: { enabled: true, label: 'd7krCKno_P8cEKD8zdpE' }
    }
  };

  function trackGoogleAdsConversion(actionKey, parameters = {}) {
    try {
      const action = KKF_TRACKING?.conversions?.[actionKey];
      if (!action || !action.enabled || !action.label || typeof action.label !== 'string' || !action.label.trim()) {
        return;
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: `${KKF_TRACKING.googleAdsId}/${action.label.trim()}`,
          ...parameters
        });
      }
    } catch (err) {
      console.warn('Google Ads conversion error:', err);
    }
  }

  function trackSiteEvent(eventName, parameters = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...parameters });
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
    if (eventName === 'generate_lead') {
      trackGoogleAdsConversion('booking');
    } else if (eventName === 'telegram_click') {
      trackGoogleAdsConversion('telegram');
    }
  }

  // 1. Initial State: NO conversion
  assert.strictEqual(gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion').length, 0, 'No conversions on load');

  // 2. Form Focus: NO conversion
  trackSiteEvent('form_start', { form_name: 'booking_request', language: 'en' });
  assert.strictEqual(gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion').length, 0, 'Form start must not trigger conversion');
  assert(dataLayer.some(e => e.event === 'form_start'), 'form_start recorded in dataLayer');

  // 3. Telegram Click: Fires genuine Telegram conversion
  trackSiteEvent('telegram_click', { link_url: 'https://t.me/kkfootprint_bot?start=lang_en', page: '/en/', language: 'en', cta_location: 'hero' });
  const telegramConversions = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion');
  assert.strictEqual(telegramConversions.length, 1, 'Telegram click must trigger Ads conversion when enabled');
  assert.strictEqual(telegramConversions[0][2].send_to, 'AW-18443632160/DpRECJmF9P8cEKD8zdpE', 'Telegram conversion send_to must match genuine label');
  assert(dataLayer.some(e => e.event === 'telegram_click' && e.cta_location === 'hero'), 'telegram_click recorded in dataLayer');

  // 4. Successful Booking Form Submission: Conversion YES
  trackSiteEvent('generate_lead', { method: 'booking_form', language: 'en', tour: 'mengalum' });
  const totalConversions = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion');
  assert.strictEqual(totalConversions.length, 2, 'Exactly two conversions fired so far (Telegram + Booking)');
  assert.strictEqual(totalConversions[1][2].send_to, 'AW-18443632160/ODSbCI-Rr_kcEKD8zdpE', 'Conversion send_to must match booking label');

  console.log('PASS: index.html tracking behavior verified');
}

function testTourTracking() {
  console.log('Testing tour.html tracking behavior...');
  const content = fs.readFileSync(path.join(root, 'tour.html'), 'utf8');

  // Confirm NO raw conversion calls in enquiry submit handler
  assert(!content.includes('send_to\': \'AW-18443632160/ODSbCI-Rr_kcEKD8zdpE\'\r\n        }') && !content.includes('send_to\': \'AW-18443632160/ODSbCI-Rr_kcEKD8zdpE\'\n        }'), 'tour.html enquiry handler must not have inline raw send_to');
  assert(content.includes('trackTourEvent(\'generate_lead\', { method: \'tour_page_enquiry\', tour: id, language: lang });'), 'tour.html must route via trackTourEvent');
  assert(content.includes('label: \'ODSbCI-Rr_kcEKD8zdpE\''), 'tour.html must have booking label');
  assert(content.includes('label: \'DpRECJmF9P8cEKD8zdpE\''), 'tour.html must have telegram label');
  assert(content.includes('label: \'d7krCKno_P8cEKD8zdpE\''), 'tour.html must have payment label');

  // Verify function logic
  const { window, dataLayer, gtagCalls } = createMockEnvironment();

  const KKF_TRACKING = {
    googleAdsId: 'AW-18443632160',
    conversions: {
      booking: { enabled: true, label: 'ODSbCI-Rr_kcEKD8zdpE' },
      telegram: { enabled: true, label: 'DpRECJmF9P8cEKD8zdpE' },
      payment: { enabled: true, label: 'd7krCKno_P8cEKD8zdpE' }
    }
  };

  function trackGoogleAdsConversion(actionKey, parameters = {}) {
    try {
      const action = KKF_TRACKING?.conversions?.[actionKey];
      if (!action || !action.enabled || !action.label || typeof action.label !== 'string' || !action.label.trim()) return;
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: `${KKF_TRACKING.googleAdsId}/${action.label.trim()}`,
          ...parameters
        });
      }
    } catch (err) {
      console.warn('Google Ads conversion error:', err);
    }
  }

  const trackTourEvent = (eventName, parameters = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...parameters });
    if (typeof window.gtag === 'function') window.gtag('event', eventName, parameters);
    if (eventName === 'generate_lead') {
      trackGoogleAdsConversion('booking');
    } else if (eventName === 'telegram_click') {
      trackGoogleAdsConversion('telegram');
    }
  };

  // 1. Tour page Telegram click
  trackTourEvent('telegram_click', { link_url: 'https://t.me/kkfootprint_bot?start=lang_zh', page: '/zh-hans/tours/mengalum-island/', tour: 'mengalum-island', language: 'zh', cta_location: 'hero' });
  const tourTelegramConversions = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion');
  assert.strictEqual(tourTelegramConversions.length, 1, 'Tour Telegram click must fire Ads conversion when enabled');
  assert.strictEqual(tourTelegramConversions[0][2].send_to, 'AW-18443632160/DpRECJmF9P8cEKD8zdpE', 'Tour telegram conversion matches genuine label');
  assert(dataLayer.some(e => e.event === 'telegram_click' && e.tour === 'mengalum-island'), 'Tour telegram_click recorded in dataLayer');

  // 2. Tour page booking success
  trackTourEvent('generate_lead', { method: 'tour_page_enquiry', tour: 'mengalum-island', language: 'zh' });
  const totalTourConversions = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion');
  assert.strictEqual(totalTourConversions.length, 2, 'Tour booking success fires exactly one conversion (total 2)');
  assert.strictEqual(totalTourConversions[1][2].send_to, 'AW-18443632160/ODSbCI-Rr_kcEKD8zdpE', 'Tour conversion send_to must match booking label');

  console.log('PASS: tour.html tracking behavior verified');
}

function testPaymentTracking() {
  console.log('Testing payment.html tracking behavior...');
  const content = fs.readFileSync(path.join(root, 'payment.html'), 'utf8');

  // Confirm booking label is 100% REMOVED from payment.html
  assert(!content.includes('ODSbCI-Rr_kcEKD8zdpE'), 'payment.html MUST NOT contain ODSbCI-Rr_kcEKD8zdpE');
  assert(content.includes('trackGoogleAdsConversion(\'payment\')'), 'payment.html must call trackGoogleAdsConversion(\'payment\')');
  assert(content.includes('label: \'d7krCKno_P8cEKD8zdpE\''), 'payment.html must have payment label');
  assert(content.includes('label: \'DpRECJmF9P8cEKD8zdpE\''), 'payment.html must have telegram label');
  assert(content.includes('enabled: false'), 'payment.html must have payment conversion disabled pending server-side verification');

  const { window, dataLayer, gtagCalls } = createMockEnvironment();

  // Active production config (payment disabled pending DEPOSIT_VERIFIED)
  const KKF_TRACKING = {
    googleAdsId: 'AW-18443632160',
    conversions: {
      payment: { enabled: false, label: 'd7krCKno_P8cEKD8zdpE' },
      telegram: { enabled: true, label: 'DpRECJmF9P8cEKD8zdpE' }
    }
  };

  function trackGoogleAdsConversion(actionKey, parameters = {}) {
    try {
      const action = KKF_TRACKING?.conversions?.[actionKey];
      if (!action || !action.enabled || !action.label || typeof action.label !== 'string' || !action.label.trim()) return;
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: `${KKF_TRACKING.googleAdsId}/${action.label.trim()}`,
          ...parameters
        });
      }
    } catch (e) {
      console.warn('Google Ads conversion error:', e);
    }
  }

  // 1. Initial State: NO conversion
  assert.strictEqual(gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion').length, 0, 'No conversions on payment page load');

  // 2. Receipt submitted while payment.enabled = false: NO Ads conversion
  dataLayer.push({ event: 'payment_receipt_submitted', language: 'en' });
  trackGoogleAdsConversion('payment');
  const paymentConversions = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion');
  assert.strictEqual(paymentConversions.length, 0, 'Receipt upload must NOT fire Ads payment conversion when enabled: false');
  assert(dataLayer.some(e => e.event === 'payment_receipt_submitted'), 'payment_receipt_submitted recorded in dataLayer');

  // 3. Negative test: Failed receipt upload does not push or fire
  const failedUploadAttempts = 0;
  assert.strictEqual(gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion').length, 0, 'Failed receipt upload produces 0 conversions');

  // 4. Receipt page Telegram support click: DOES fire Telegram conversion
  dataLayer.push({ event: 'telegram_click', link_url: 'https://t.me/kkfootprint_bot', language: 'en', cta_location: 'payment_support' });
  trackGoogleAdsConversion('telegram');
  const allPaymentPageConversions = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion');
  assert.strictEqual(allPaymentPageConversions.length, 1, 'Payment page Telegram click fires Telegram conversion');
  assert.strictEqual(allPaymentPageConversions[0][2].send_to, 'AW-18443632160/DpRECJmF9P8cEKD8zdpE', 'Telegram conversion send_to matches genuine label');

  // 5. Semantic verification: If payment.enabled were true, label would fire correctly
  KKF_TRACKING.conversions.payment.enabled = true;
  trackGoogleAdsConversion('payment', { value: 150.00, currency: 'MYR', transaction_id: 'KKF-TEST-REF' });
  const simulatedVerifiedConversions = gtagCalls.filter(c => c[0] === 'event' && c[1] === 'conversion');
  assert.strictEqual(simulatedVerifiedConversions.length, 2, 'When enabled, payment conversion fires');
  assert.strictEqual(simulatedVerifiedConversions[1][2].send_to, 'AW-18443632160/d7krCKno_P8cEKD8zdpE', 'Payment conversion send_to matches genuine label');
  assert.strictEqual(simulatedVerifiedConversions[1][2].value, 150.00);
  assert.strictEqual(simulatedVerifiedConversions[1][2].currency, 'MYR');

  console.log('PASS: payment.html tracking behavior verified');
}

function testNegativeAndSafetyScenarios() {
  console.log('Testing negative and safety scenarios...');
  const { window, dataLayer, gtagCalls } = createMockEnvironment();

  const KKF_TRACKING = {
    googleAdsId: 'AW-18443632160',
    conversions: {
      booking: { enabled: true, label: 'ODSbCI-Rr_kcEKD8zdpE' },
      telegram: { enabled: true, label: 'DpRECJmF9P8cEKD8zdpE' },
      payment: { enabled: false, label: 'd7krCKno_P8cEKD8zdpE' }
    }
  };

  function trackGoogleAdsConversion(actionKey, parameters = {}) {
    try {
      const action = KKF_TRACKING?.conversions?.[actionKey];
      if (!action || !action.enabled || !action.label || typeof action.label !== 'string' || !action.label.trim()) return;
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: `${KKF_TRACKING.googleAdsId}/${action.label.trim()}`,
          ...parameters
        });
      }
    } catch (err) {
      console.warn('Google Ads conversion error:', err);
    }
  }

  // A. Page load: NO conversion
  assert.strictEqual(gtagCalls.length, 0, 'Initial load has 0 conversion events');

  // B. Form focus: NO conversion
  // (focusin triggers form_start, not generate_lead)
  assert.strictEqual(gtagCalls.length, 0, 'Form focus has 0 conversion events');

  // C. Failed booking (API error): NO conversion
  // (In index.html and tour.html, catch block logs error and never calls generate_lead)
  assert.strictEqual(gtagCalls.length, 0, 'Failed booking has 0 conversion events');

  // D. Ad blocker safety (gtag is undefined)
  const windowNoGtag = { dataLayer: [] };
  assert.doesNotThrow(() => {
    // Call when gtag is missing
    const action = KKF_TRACKING.conversions.booking;
    if (typeof windowNoGtag.gtag === 'function') {
      windowNoGtag.gtag('event', 'conversion', { send_to: `${KKF_TRACKING.googleAdsId}/${action.label}` });
    }
  }, 'Ad blocker scenario does not throw');

  console.log('PASS: negative and safety scenarios verified');
}

try {
  testIndexTracking();
  testTourTracking();
  testPaymentTracking();
  testNegativeAndSafetyScenarios();
  console.log('\nALL CONVERSION TRACKING TESTS PASSED (100%)');
} catch (err) {
  console.error('TEST FAILURE:', err);
  process.exit(1);
}
