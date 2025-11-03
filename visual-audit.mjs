import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  console.log('📸 Capturing Next.js frontend (http://localhost:3001)...');
  
  // Homepage
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'nextjs-homepage.png', fullPage: true });
  console.log('✓ Homepage screenshot saved');

  // Cursos page
  await page.goto('http://localhost:3001/cursos', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'nextjs-cursos.png', fullPage: true });
  console.log('✓ Cursos page screenshot saved');

  // Design Hub
  await page.goto('http://localhost:3001/design-hub', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'nextjs-design-hub.png', fullPage: true });
  console.log('✓ Design Hub screenshot saved');

  // Extract computed styles
  const styleAudit = await page.evaluate(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const body = document.body;
    
    const getComputedStyles = (el, props) => {
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      const result = {};
      props.forEach(prop => {
        result[prop] = computed.getPropertyValue(prop);
      });
      return result;
    };

    return {
      header: getComputedStyles(header, ['background-color', 'box-shadow', 'height', 'position']),
      footer: getComputedStyles(footer, ['background-color', 'color', 'padding']),
      body: getComputedStyles(body, ['font-family', 'font-size', 'line-height', 'background-color']),
      primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--color-primary'),
      secondaryColor: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary'),
    };
  });

  await writeFile('nextjs-style-audit.json', JSON.stringify(styleAudit, null, 2));
  console.log('✓ Style audit saved to nextjs-style-audit.json');

  await browser.close();
  
  console.log('\n✅ Visual audit complete!');
  console.log('\nNext.js Frontend Analysis:');
  console.log('─────────────────────────────');
  console.log('Header Background:', styleAudit.header?.['background-color']);
  console.log('Footer Background:', styleAudit.footer?.['background-color']);
  console.log('Font Family:', styleAudit.body?.['font-family']);
  console.log('Primary Color:', styleAudit.primaryColor);
  console.log('Secondary Color:', styleAudit.secondaryColor);
})();
