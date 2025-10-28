// Test All Breakpoints - Complete Responsive Test (2025 Standards)
import { chromium } from '@playwright/test';

(async () => {
  console.log('📱 TEST COMPLETO DE BREAKPOINTS - Estándares 2025');
  console.log('══════════════════════════════════════════════════════════\n');

  const viewports = [
    { name: 'Móvil pequeño (portrait)', width: 375, height: 667, category: '320-480px' },
    { name: 'Móvil grande (landscape)', width: 540, height: 720, category: '481-575px' },
    { name: 'Tablet (portrait)', width: 640, height: 960, category: '576-767px' },
    { name: 'Tablet (landscape)', width: 900, height: 1200, category: '768-991px' },
    { name: 'Escritorio estándar', width: 1100, height: 800, category: '992-1199px' },
    { name: 'Escritorio grande', width: 1366, height: 768, category: '1200-1439px' },
    { name: 'Pantalla XL / TV', width: 1600, height: 900, category: '1440-1919px' },
    { name: 'Pantalla 4K', width: 1920, height: 1080, category: '1920px+' },
    { name: 'Ultra Wide', width: 2560, height: 1440, category: 'Ultra Wide' },
  ];

  const browser = await chromium.launch({ headless: false });

  for (const viewport of viewports) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📐 TESTING: ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log(`   Categoría: ${viewport.category}`);
    console.log('─'.repeat(60));

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    // Test HomePage
    console.log(`\n  📍 HomePage (http://localhost:3001/)...`);
    await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Check Navigation
    const hamburgerButton = await page.locator('button[aria-label="Toggle menu"]');
    const desktopNavLinks = await page.locator('nav a[href="/cursos"]').first();

    const isHamburgerVisible = await hamburgerButton.isVisible().catch(() => false);
    const isDesktopNavVisible = await desktopNavLinks.isVisible().catch(() => false);

    console.log(`    Navegación:`);
    console.log(`      - Hamburger menu: ${isHamburgerVisible ? '✅ Visible' : '❌ Oculto'}`);
    console.log(`      - Desktop nav: ${isDesktopNavVisible ? '✅ Visible' : '❌ Oculto'}`);

    // Check Hero Typography
    const heroH1 = await page.locator('section.hero h1').first();
    const heroP = await page.locator('section.hero p').first();

    if (await heroH1.count() > 0) {
      const h1FontSize = await heroH1.evaluate(el => window.getComputedStyle(el).fontSize);
      const pFontSize = await heroP.evaluate(el => window.getComputedStyle(el).fontSize);
      console.log(`    Hero Typography:`);
      console.log(`      - H1 font-size: ${h1FontSize}`);
      console.log(`      - P font-size: ${pFontSize}`);
    }

    // Check Course Grid
    const courseGrid = await page.locator('.grid').first();
    if (await courseGrid.count() > 0) {
      const gridCols = await courseGrid.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);
      const colCount = gridCols.split(' ').length;
      console.log(`    Course Grid:`);
      console.log(`      - Columnas: ${colCount}`);
    }

    // Check Footer Grid
    const footerGrid = await page.locator('footer .grid').first();
    if (await footerGrid.count() > 0) {
      const gridCols = await footerGrid.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);
      const colCount = gridCols.split(' ').length;
      console.log(`    Footer Grid:`);
      console.log(`      - Columnas: ${colCount}`);
    }

    // Screenshot
    await page.screenshot({
      path: `breakpoint-${viewport.width}px-homepage.png`,
      fullPage: false
    });
    console.log(`    ✅ Screenshot: breakpoint-${viewport.width}px-homepage.png`);

    // Test Design Hub
    console.log(`\n  📍 Design Hub...`);
    await page.goto('http://localhost:3001/design-hub', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Check Design Hub Layout
    const designHubGrid = await page.locator('.design-hub > div > div.grid').first();
    if (await designHubGrid.count() > 0) {
      const gridCols = await designHubGrid.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);
      const colCount = gridCols.split(' ').length;
      console.log(`    Design Hub Layout:`);
      console.log(`      - Columnas principales: ${colCount}`);
    }

    await page.screenshot({
      path: `breakpoint-${viewport.width}px-designhub.png`,
      fullPage: false
    });
    console.log(`    ✅ Screenshot: breakpoint-${viewport.width}px-designhub.png`);

    await context.close();
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ TEST COMPLETO DE BREAKPOINTS FINALIZADO');
  console.log(`\n📊 Resumen de Breakpoints Testeados:`);
  console.log('   - Móvil pequeño: 375px (320-480px)');
  console.log('   - Móvil grande: 540px (481-575px)');
  console.log('   - Tablet portrait: 640px (576-767px)');
  console.log('   - Tablet landscape: 900px (768-991px)');
  console.log('   - Escritorio estándar: 1100px (992-1199px)');
  console.log('   - Escritorio grande: 1366px (1200-1439px)');
  console.log('   - Pantalla XL: 1600px (1440-1919px)');
  console.log('   - 4K: 1920px');
  console.log('   - Ultra Wide: 2560px');
  console.log(`\n📸 Total de screenshots generados: ${viewports.length * 2}`);
  console.log('   Ubicación: ./breakpoint-*px-*.png\n');

  await browser.close();
})();
