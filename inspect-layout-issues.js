// Inspect Layout Issues - Diagnose margin/padding/div problems
import { chromium } from '@playwright/test';

(async () => {
  console.log('🔍 INSPECCIÓN DE PROBLEMAS DE LAYOUT');
  console.log('═══════════════════════════════════════════════════\n');

  const viewports = [
    { name: 'Móvil pequeño', width: 375, height: 667 },
    { name: 'Móvil grande', width: 540, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Escritorio estándar', width: 1100, height: 800 },
  ];

  const browser = await chromium.launch({ headless: false });

  for (const viewport of viewports) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📐 ${viewport.name} (${viewport.width}x${viewport.height})`);
    console.log('─'.repeat(60));

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Check container dimensions
    console.log('\n📦 CONTENEDORES:');
    const container = await page.locator('.container').first();
    if (await container.count() > 0) {
      const containerStyles = await container.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          width: styles.width,
          maxWidth: styles.maxWidth,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
          marginLeft: styles.marginLeft,
          marginRight: styles.marginRight,
        };
      });
      console.log('  .container:');
      console.log(`    width: ${containerStyles.width}`);
      console.log(`    max-width: ${containerStyles.maxWidth}`);
      console.log(`    padding: ${containerStyles.paddingLeft} / ${containerStyles.paddingRight}`);
      console.log(`    margin: ${containerStyles.marginLeft} / ${containerStyles.marginRight}`);
    }

    // Check body overflow
    console.log('\n📏 OVERFLOW:');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = viewport.width;
    const hasHorizontalScroll = bodyWidth > viewportWidth;
    console.log(`  Viewport width: ${viewportWidth}px`);
    console.log(`  Body scrollWidth: ${bodyWidth}px`);
    console.log(`  Horizontal scroll: ${hasHorizontalScroll ? '❌ SÍ (PROBLEMA)' : '✅ NO'}`);

    // Check hero section
    console.log('\n🎨 HERO SECTION:');
    const hero = await page.locator('section.hero').first();
    if (await hero.count() > 0) {
      const heroStyles = await hero.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
        };
      });
      console.log('  section.hero:');
      console.log(`    padding-y: ${heroStyles.paddingTop} / ${heroStyles.paddingBottom}`);
      console.log(`    padding-x: ${heroStyles.paddingLeft} / ${heroStyles.paddingRight}`);

      // Check hero content max-width
      const heroContent = await page.locator('section.hero > div > div').first();
      if (await heroContent.count() > 0) {
        const heroContentStyles = await heroContent.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            maxWidth: styles.maxWidth,
            width: styles.width,
          };
        });
        console.log('  hero content div:');
        console.log(`    max-width: ${heroContentStyles.maxWidth}`);
        console.log(`    width: ${heroContentStyles.width}`);
      }
    }

    // Check grid gaps
    console.log('\n📐 GRIDS:');
    const courseGrid = await page.locator('.grid').first();
    if (await courseGrid.count() > 0) {
      const gridStyles = await courseGrid.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          gap: styles.gap,
          gridTemplateColumns: styles.gridTemplateColumns,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
        };
      });
      console.log('  .grid (courses):');
      console.log(`    gap: ${gridStyles.gap}`);
      console.log(`    columns: ${gridStyles.gridTemplateColumns}`);
      console.log(`    padding: ${gridStyles.paddingLeft} / ${gridStyles.paddingRight}`);
    }

    // Check for elements causing overflow
    console.log('\n⚠️  ELEMENTOS ANCHOS:');
    const wideElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const viewportWidth = window.innerWidth;
      const wide = elements
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > viewportWidth;
        })
        .slice(0, 5) // Only first 5
        .map(el => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            class: el.className,
            width: Math.round(rect.width),
          };
        });
      return wide;
    });

    if (wideElements.length > 0) {
      wideElements.forEach(el => {
        console.log(`  ❌ ${el.tag}.${el.class.substring(0, 30)}: ${el.width}px`);
      });
    } else {
      console.log('  ✅ No se encontraron elementos más anchos que el viewport');
    }

    // Screenshot with highlighted containers
    await page.addStyleTag({
      content: `
        .container { outline: 2px solid red !important; }
        .grid { outline: 2px solid blue !important; }
        section { outline: 1px solid green !important; }
      `
    });
    await page.screenshot({
      path: `layout-debug-${viewport.width}px.png`,
      fullPage: false
    });
    console.log(`\n📸 Screenshot: layout-debug-${viewport.width}px.png`);
    console.log('   (Red = .container, Blue = .grid, Green = section)');

    await context.close();
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('✅ INSPECCIÓN COMPLETA');

  await browser.close();
})();
