// Test Fluid Responsive - Verifica responsividad en CUALQUIER ancho
import { chromium } from '@playwright/test';

(async () => {
  console.log('🌊 TEST RESPONSIVIDAD FLUIDA - Auto-adaptación a CUALQUIER tamaño');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Test con anchos intermedios (no solo breakpoints)
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Intermedio móvil-tablet', width: 500, height: 800 },
    { name: 'iPad Mini', width: 768, height: 1024 },
    { name: 'Intermedio tablet-desktop', width: 950, height: 800 },
    { name: 'MacBook Air', width: 1280, height: 800 },
    { name: 'Desktop común', width: 1440, height: 900 },
    { name: 'iMac 27"', width: 2560, height: 1440 },
  ];

  const browser = await chromium.launch({ headless: false });

  for (const viewport of viewports) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📏 ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log('─'.repeat(70));

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Check Hero Typography
    console.log('\n  📐 HERO (Typography fluida con clamp):');
    const heroH1 = await page.locator('section.hero h1').first();
    if (await heroH1.count() > 0) {
      const h1FontSize = await heroH1.evaluate(el => window.getComputedStyle(el).fontSize);
      console.log(`    H1 font-size: ${h1FontSize}`);
    }

    const heroP = await page.locator('section.hero p').first();
    if (await heroP.count() > 0) {
      const pFontSize = await heroP.evaluate(el => window.getComputedStyle(el).fontSize);
      console.log(`    P font-size: ${pFontSize}`);
    }

    // Check Fluid Grid - Course Cards
    console.log('\n  🎴 COURSE CARDS (Grid auto-fit):');
    const courseGrid = await page.locator('.grid-fluid-cards').first();
    if (await courseGrid.count() > 0) {
      const gridCols = await courseGrid.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          gridTemplateColumns: styles.gridTemplateColumns,
          gap: styles.gap,
        };
      });
      const colCount = gridCols.gridTemplateColumns.split(' ').length;
      console.log(`    Columnas: ${colCount}`);
      console.log(`    Gap: ${gridCols.gap}`);

      // Check individual card width
      const firstCard = await page.locator('.grid-fluid-cards > *').first();
      if (await firstCard.count() > 0) {
        const cardWidth = await firstCard.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return Math.round(rect.width);
        });
        console.log(`    Ancho por card: ${cardWidth}px`);
      }
    }

    // Check Features Grid
    console.log('\n  ⭐ FEATURES (Grid auto-fit):');
    const featuresGrid = await page.locator('.grid-fluid-features').first();
    if (await featuresGrid.count() > 0) {
      const gridCols = await featuresGrid.evaluate(el =>
        window.getComputedStyle(el).gridTemplateColumns
      );
      const colCount = gridCols.split(' ').length;
      console.log(`    Columnas: ${colCount}`);
    }

    // Check Footer Grid
    console.log('\n  🦶 FOOTER (Grid auto-fit):');
    const footerGrid = await page.locator('.grid-fluid-footer').first();
    if (await footerGrid.count() > 0) {
      const gridCols = await footerGrid.evaluate(el =>
        window.getComputedStyle(el).gridTemplateColumns
      );
      const colCount = gridCols.split(' ').length;
      console.log(`    Columnas: ${colCount}`);
    }

    // Check for horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const hasScroll = bodyWidth > viewport.width;
    console.log(`\n  📏 Scroll horizontal: ${hasScroll ? '❌ SÍ (problema)' : '✅ NO'}`);
    console.log(`     Body width: ${bodyWidth}px | Viewport: ${viewport.width}px`);

    // Screenshot
    await page.screenshot({
      path: `fluid-${viewport.width}px.png`,
      fullPage: false
    });
    console.log(`\n  📸 Screenshot: fluid-${viewport.width}px.png`);

    await context.close();
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ TEST DE RESPONSIVIDAD FLUIDA COMPLETO');
  console.log('\n💡 Comportamiento esperado:');
  console.log('   - Tipografía escala suavemente (no saltos bruscos)');
  console.log('   - Cards se reorganizan dinámicamente a CUALQUIER ancho');
  console.log('   - Sin scroll horizontal en ningún tamaño');
  console.log('   - Gaps y padding escalan proporcionalmente');
  console.log(`\n📸 Screenshots generados: ${viewports.length}`);

  await browser.close();
})();
