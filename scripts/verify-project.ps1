$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Assert-True([bool]$condition, [string]$message) {
  if (-not $condition) { throw "FAILED: $message" }
  Write-Host "PASS: $message"
}

Write-Host "KKfootprint project verification"

# Worker must parse before it can be deployed.
node --check worker/src/index.js
Assert-True ($LASTEXITCODE -eq 0) 'Worker JavaScript syntax is valid'

# The public sitemap must be well-formed XML and only contain absolute canonical URLs.
[xml]$sitemap = Get-Content sitemap.xml -Raw
$urls = @($sitemap.urlset.url | ForEach-Object { [string]$_.loc })
Assert-True ($urls.Count -ge 9) 'Sitemap contains the public landing and tour URLs'
Assert-True (($urls | Where-Object { $_ -notmatch '^https://kkfootprint\.com/' }).Count -eq 0) 'Sitemap uses the canonical HTTPS domain only'
Assert-True (($urls | Where-Object { $_ -match '/admin|/payment' }).Count -eq 0) 'Private admin and receipt pages are excluded from sitemap'

$robots = Get-Content robots.txt -Raw
Assert-True ($robots -match 'Sitemap:\s*https://kkfootprint\.com/sitemap\.xml') 'robots.txt advertises the canonical sitemap'
Assert-True ($robots -match 'Disallow:\s*/admin') 'robots.txt blocks the private admin page'
Assert-True ($robots -match 'Disallow:\s*/payment') 'robots.txt blocks payment receipt pages'

$payment = Get-Content payment.html -Raw
Assert-True ($payment -match '<meta name="robots" content="noindex,nofollow">') 'Payment page cannot be indexed'
Assert-True ($payment -match '/api/rex/payment-intent\?ref=') 'Payment page obtains amount from the protected payment-intent endpoint'
Assert-True ($payment -notmatch 'Number\(params\.get\(["'']amount["'']\)\)') 'Payment page does not trust a URL amount parameter'
Assert-True ($payment -match 'paymentReady=true') 'Receipt submission stays disabled until server approval'
Assert-True ($payment -match 'challenges\.cloudflare\.com/turnstile') 'Receipt page embeds the Turnstile browser challenge'
Assert-True ($payment -match 'turnstileToken') 'Receipt page sends the Turnstile token with the upload'
Assert-True ($payment -match 'Maximum 15 MB') 'Receipt page displays the 15 MB upload limit'

$admin = Get-Content admin.html -Raw
Assert-True ($admin -match '<meta name="robots" content="noindex,nofollow,noarchive">') 'Admin dashboard cannot be indexed'
Assert-True ($admin -match '/api/rex/admin/conversations') 'Admin dashboard reads only through the protected conversation API'
Assert-True ($admin -match '/api/rex/admin/reply') 'Admin dashboard sends staff replies through the protected reply API'
Assert-True ($admin -match 'Reply as KKfootprint Travel staff') 'Admin dashboard provides an explicit staff-reply composer'

$worker = Get-Content worker/src/index.js -Raw
Assert-True ($worker -match "url\.pathname === '/api/rex/payment-intent'") 'Worker serves the payment-intent endpoint'
Assert-True ($worker -match "url\.pathname === '/api/rex/admin/reply'") 'Worker serves the private admin staff-reply endpoint'
Assert-True ($worker -match 'validateSameOriginFetch') 'Payment-intent endpoint enforces same-origin access'
Assert-True ($worker -match 'isCustomAdminHost\(new URL\(request\.url\)\)') 'Admin replies are limited to the protected custom domain'
Assert-True ($worker -match "'website_payment_receipt_preflight'") 'Payment-intent uses the approved booking eligibility workflow'
Assert-True ($worker -match 'verifyTurnstileIfEnabled\(turnstileToken, request, env\)') 'Worker validates Turnstile tokens when enabled'
Assert-True ($worker -match 'const MAX_RECEIPT_BYTES = 15 \* 1024 \* 1024') 'Worker enforces the 15 MB receipt limit'

$landing = Get-Content index.html -Raw
Assert-True ($landing -match '0x4AAAAAAEsprhUOno51AQDQ') 'Landing booking form contains the configured public Turnstile site key'
Assert-True ($landing -match 'Staff may join any conversation from the private desk') 'Website chat polls for an admin reply after every REX turn'
Assert-True ($landing -match 'rel="icon" href="/favicon\.jpg"') 'Landing page declares the supplied square favicon used by search engines'
Assert-True ($landing -match 'kkfootprint-footprint-logo\.jpg') 'Landing header displays the supplied footprint logo'
Assert-True ($landing -match 'booking-summary-brand') 'Booking confirmation summary displays the official logo'
Assert-True ($landing -match 'chatbot-brand') 'REX chat header displays the official logo'
Assert-True ($landing -match 'chatbot-toggle.*kkfootprint-footprint-logo\.jpg') 'REX chat bubble displays the official logo'
Assert-True ($landing -match 'Hotel pickup by car is at 6:55 AM') 'Landing page states the authoritative Mengalum hotel pickup time'
Assert-True ($landing -match 'boat departs at 7:40 AM') 'Landing page states the authoritative Mengalum boat departure time'
Assert-True ($landing -match 'Chinese support on request') 'English landing page does not promise guaranteed Chinese-speaking service'
Assert-True ($landing -match '中文协助须提前确认') 'Chinese landing page requires Chinese-language support to be confirmed'

$tourDetail = Get-Content tour.html -Raw
Assert-True ($tourDetail -match '6:55 AM hotel pickup') 'Mengalum detail page starts with the 6:55 AM hotel pickup'
Assert-True (($tourDetail -match 'Boat departure to Mengalum Island') -and ($tourDetail -match '7:40 AM')) 'Mengalum detail page distinguishes the 7:40 AM boat departure'
Assert-True ($tourDetail -match 'Chinese-language support must be confirmed before booking') 'English tour detail pages do not promise Chinese-speaking service'

Assert-True (Test-Path 'favicon.jpg') 'Supplied square logo is available as the favicon'
Assert-True (Test-Path 'images/brand/kkfootprint-footprint-logo.jpg') 'Supplied footprint logo asset is included in the project'

$paymentPage = Get-Content payment.html -Raw
Assert-True ($paymentPage -match 'kkfootprint-footprint-logo\.jpg') 'Receipt upload page displays the official logo'
$tourPage = Get-Content tour.html -Raw
Assert-True ($tourPage -match 'kkfootprint-footprint-logo\.jpg') 'Tour pages display the official logo'

Write-Host "All local verification checks passed."
