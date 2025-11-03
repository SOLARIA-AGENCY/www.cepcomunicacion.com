import { chromium } from 'playwright';

(async () => {
  console.log('🔍 Starting visual inspection...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('📍 Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 10000 });

    // Take screenshot
    await page.screenshot({ path: 'nextjs-homepage-full.png', fullPage: true });
    console.log('✅ Screenshot saved: nextjs-homepage-full.png\n');

    // Check if Header is visible
    const header = await page.$('header');
    if (header) {
      const headerBox = await header.boundingBox();
      console.log('📦 Header found:', headerBox);

      // Check Header computed styles
      const headerStyles = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        const computed = window.getComputedStyle(header);
        return {
          backgroundColor: computed.backgroundColor,
          boxShadow: computed.boxShadow,
          position: computed.position,
          zIndex: computed.zIndex,
          display: computed.display,
          visibility: computed.visibility,
          height: computed.height,
        };
      });
      console.log('🎨 Header styles:', JSON.stringify(headerStyles, null, 2));
    } else {
      console.log('❌ Header NOT found in DOM');
    }

    // Check navigation links
    const navLinks = await page.$$('header nav a');
    console.log(`\n🔗 Navigation links found: ${navLinks.length}`);

    for (let i = 0; i < navLinks.length; i++) {
      const text = await navLinks[i].textContent();
      const isVisible = await navLinks[i].isVisible();
      const box = await navLinks[i].boundingBox();
      console.log(`  ${i + 1}. "${text}" - Visible: ${isVisible}, Box:`, box);
    }

    // Check if Tailwind CSS is loaded
    const cssLoaded = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        fontFamily: computed.fontFamily,
        backgroundColor: computed.backgroundColor,
        customPrimary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
      };
    });
    console.log('\n🎨 CSS Variables:', JSON.stringify(cssLoaded, null, 2));

    // Check for stylesheet links
    const stylesheets = await page.$$eval('link[rel="stylesheet"]', links =>
      links.map(link => link.href)
    );
    console.log('\n📄 Stylesheets loaded:');
    stylesheets.forEach((href, i) => console.log(`  ${i + 1}. ${href}`));

  } catch (error) {
    console.error('❌ Error during inspection:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Inspection complete!');
  }
})();
