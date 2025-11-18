/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker deployment
  output: 'standalone',

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // Disable ESLint in dev temporarily
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization - SECURITY: Whitelist specific domains only (no wildcards)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3002',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
      },
      // Add production domains when deploying:
      // {
      //   protocol: 'https',
      //   hostname: 'cepcomunicacion.com',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.cepcomunicacion.com',
      // },
    ],
  },

  // ============================================================================
  // SECURITY HEADERS (P1 PRIORITY - SecurityHeaders.com Grade A+ Target)
  // ============================================================================
  /**
   * Comprehensive security headers to protect against common web vulnerabilities:
   * - HSTS: Enforce HTTPS-only connections
   * - XSS Protection: Prevent cross-site scripting attacks
   * - Clickjacking: Prevent iframe embedding attacks
   * - MIME Sniffing: Prevent content-type confusion attacks
   * - Referrer Policy: Control referrer information leakage
   * - Permissions Policy: Restrict access to browser features
   * - CSP: Content Security Policy (report-only mode initially)
   *
   * @see https://securityheaders.com for scoring
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers for header specs
   */
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // ========================================================================
          // HSTS - HTTP Strict Transport Security
          // ========================================================================
          /**
           * Force HTTPS for 1 year (31536000 seconds)
           * - includeSubDomains: Apply to all subdomains
           * - preload: Allow inclusion in browser HSTS preload lists
           *
           * WARNING: Only enable in production with valid SSL certificate
           * Remove in development (localhost) to avoid browser cache issues
           */
          {
            key: 'Strict-Transport-Security',
            value:
              process.env.NODE_ENV === 'production'
                ? 'max-age=31536000; includeSubDomains; preload'
                : 'max-age=0', // Disable in development
          },

          // ========================================================================
          // X-Frame-Options - Clickjacking Protection
          // ========================================================================
          /**
           * Prevent page from being embedded in <iframe>, <frame>, <embed>, <object>
           * Options:
           * - DENY: Never allow framing
           * - SAMEORIGIN: Allow framing only from same origin
           *
           * Protects against clickjacking attacks where malicious sites
           * overlay transparent iframes to trick users into clicking hidden elements
           */
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // ========================================================================
          // X-Content-Type-Options - MIME Sniffing Protection
          // ========================================================================
          /**
           * Prevent browsers from MIME-sniffing responses away from declared content-type
           * Forces browser to respect Content-Type header
           *
           * Prevents attacks where malicious content is disguised as safe file types
           * Example: Image file containing executable JavaScript
           */
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // ========================================================================
          // X-XSS-Protection - Legacy XSS Filter (for older browsers)
          // ========================================================================
          /**
           * Enable XSS filtering in older browsers (IE, Safari)
           * Mode: 1; mode=block stops rendering page if XSS attack detected
           *
           * NOTE: Modern browsers use CSP instead (see below)
           * Kept for backward compatibility with older browsers
           */
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          // ========================================================================
          // Referrer-Policy - Control Referrer Information Leakage
          // ========================================================================
          /**
           * strict-origin-when-cross-origin:
           * - Same-origin: Send full URL
           * - Cross-origin HTTPS→HTTPS: Send origin only
           * - Cross-origin HTTPS→HTTP: Send nothing (downgrade)
           *
           * Balances privacy with analytics/debugging needs
           * Prevents leaking sensitive URL parameters to third parties
           */
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // ========================================================================
          // Permissions-Policy - Restrict Browser Features
          // ========================================================================
          /**
           * Control access to powerful browser APIs:
           * - camera: Disable camera access (not needed)
           * - microphone: Disable microphone access (not needed)
           * - geolocation: Disable geolocation (not needed)
           * - payment: Disable Payment Request API (not needed)
           * - usb: Disable WebUSB (not needed)
           * - interest-cohort: Disable FLoC (privacy protection)
           *
           * Reduces attack surface by denying unnecessary permissions
           * Protects user privacy by preventing tracking APIs
           */
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },

          // ========================================================================
          // Content-Security-Policy-Report-Only - CSP (Initial Report-Only Mode)
          // ========================================================================
          /**
           * Content Security Policy - CRITICAL for XSS prevention
           *
           * STRATEGY: Start in report-only mode to:
           * 1. Identify violations without breaking functionality
           * 2. Tune policy based on real usage patterns
           * 3. Gradually transition to enforcing mode
           *
           * Current Policy:
           * - default-src 'self': Only load resources from same origin
           * - script-src 'self' 'unsafe-inline' 'unsafe-eval': Allow inline/eval scripts
           *   (needed for Next.js hot reload and Payload CMS admin)
           * - style-src 'self' 'unsafe-inline': Allow inline styles (needed for CSS-in-JS)
           * - img-src 'self' data: https:: Allow images from self, data URIs, and HTTPS
           * - font-src 'self': Only load fonts from same origin
           * - connect-src 'self': Only XHR/fetch to same origin
           * - media-src 'self': Only audio/video from same origin
           * - object-src 'none': Block Flash, Java applets, etc.
           * - frame-ancestors 'none': Prevent embedding (redundant with X-Frame-Options)
           * - base-uri 'self': Prevent <base> tag injection
           * - form-action 'self': Only submit forms to same origin
           * - upgrade-insecure-requests: Auto-upgrade HTTP to HTTPS
           *
           * NEXT STEPS (before enforcing):
           * 1. Monitor violations in browser console
           * 2. Refine 'unsafe-inline' and 'unsafe-eval' usage
           * 3. Add nonces for inline scripts
           * 4. Whitelist specific external domains (analytics, CDNs)
           * 5. Change to 'Content-Security-Policy' (enforcing mode)
           *
           * TODO: Replace with enforcing CSP after testing:
           * - Remove 'unsafe-inline' and 'unsafe-eval'
           * - Implement nonce-based CSP for inline scripts
           * - Whitelist specific external domains only
           */
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },

          // ========================================================================
          // X-DNS-Prefetch-Control - Control DNS Prefetching
          // ========================================================================
          /**
           * Disable DNS prefetching for privacy
           * Prevents browser from proactively resolving domain names
           * Reduces information leakage to DNS providers
           */
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },

          // ========================================================================
          // X-Download-Options - Disable MIME-handling Feature in IE
          // ========================================================================
          /**
           * Prevent Internet Explorer from executing downloads in site context
           * Forces IE to save downloads instead of opening them
           */
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },
        ],
      },
    ];
  },
};

// Export Next.js config directly (Payload removed as part of ADR-003 migration)
export default nextConfig;