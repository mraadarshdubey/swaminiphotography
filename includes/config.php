<?php
/**
 * Swamini Photography & Cinematography
 * Core Configuration & Security Settings
 */

// Start session securely if not already active
if (session_status() === PHP_SESSION_NONE) {
    // Secure session cookies
    // No 'domain' key: the browser then scopes the cookie to the current host.
    // Using HTTP_HOST broke sessions whenever it carried a port (e.g. localhost:8000).
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
    session_start();
}

// Brand & Business Details (Source of Truth)
define('SITE_NAME', 'Swamini Photography & Cinematography');
define('PHOTOGRAPHER_NAME', 'Navanit Patil');
define('TAGLINE', 'Your Moments. Our Passion. Memories Forever.');
define('PRIMARY_PHONE', '7276505046');
define('WHATSAPP_PHONE', '8432582511');
define('BUSINESS_EMAIL', 'enquiry@swaminiphotography.com'); // Admin receiver email
define('BUSINESS_ADDRESS', 'Shop No. 102, Namrata Iconic-3, Tapodha Colony, Varale Road, Talegaon Dabhade - 410507');
define('BUSINESS_CITY', 'Talegaon Dabhade');
define('BUSINESS_PINCODE', '410507');

// Mailer & SMTP Configuration
define('USE_SMTP', false); // Set to true when live SMTP credentials are provided
define('SMTP_HOST', 'smtp.example.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'user@example.com');
define('SMTP_PASS', 'secret_password');
define('SMTP_SECURE', 'tls'); // 'tls' or 'ssl'
define('MAIL_FROM_EMAIL', 'no-reply@swaminiphotography.com');
define('MAIL_FROM_NAME', 'Swamini Photography');

// Enquiry log folder. logs/.htaccess blocks web access on Apache/LiteSpeed hosts.
// On nginx (or any host that ignores .htaccess) point this outside the public folder,
// e.g. dirname(__DIR__, 2) . '/swamini_logs'
define('LOG_DIR', __DIR__ . '/../logs');

// Rate limiting settings (max submissions per IP per time frame)
define('RATE_LIMIT_MAX', 5);
define('RATE_LIMIT_WINDOW', 300); // 5 minutes in seconds

// Services catalog for validation
$VALID_SERVICES = [
    'wedding' => 'Wedding Photography & Cinematography',
    'pre_wedding' => 'Pre-Wedding & Engagement',
    'maternity' => 'Maternity Photography',
    'baby' => 'Baby & Newborn Photography',
    'events' => 'Birthday & Event Photography',
    'couple' => 'Couple Photography',
    'albums' => 'Premium Photo Frames & Albums',
    'corporate' => 'Corporate Photography',
    'custom' => 'Custom Package Enquiry'
];
