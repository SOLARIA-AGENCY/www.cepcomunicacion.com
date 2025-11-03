// Quick Hero Verification
import { chromium } from '@playwright/test';

(async () => {
  console.log('🎯 VERIFICACIÓN HERO - Centrado y Colores');
  console.log('═══════════════════════════════════════════\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3001/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  console.log('📐 HERO ALIGNMENT:');

  // Check hero container
  const heroContainer = await page.locator('section.hero > div > div').first();
  if (await heroContainer.count() > 0) {
    const containerStyles = await heroContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        textAlign: styles.textAlign,
        marginLeft: styles.marginLeft,
        marginRight: styles.marginRight,
        maxWidth: styles.maxWidth,
      };
    });
    console.log('  Hero container:');
    console.log(`    text-align: ${containerStyles.textAlign} ${containerStyles.textAlign === 'center' ? '✅' : '❌'}`);
    console.log(`    margin-left: ${containerStyles.marginLeft}`);
    console.log(`    margin-right: ${containerStyles.marginRight}`);
    console.log(`    max-width: ${containerStyles.maxWidth}`);
  }

  // Check H1
  const heroH1 = await page.locator('section.hero h1').first();
  if (await heroH1.count() > 0) {
    const h1Align = await heroH1.evaluate(el => window.getComputedStyle(el).textAlign);
    console.log(`  H1 text-align: ${h1Align} ${h1Align === 'center' ? '✅' : '❌'}`);
  }

  // Check paragraph
  const heroP = await page.locator('section.hero p').first();
  if (await heroP.count() > 0) {
    const pAlign = await heroP.evaluate(el => window.getComputedStyle(el).textAlign);
    console.log(`  P text-align: ${pAlign} ${pAlign === 'center' ? '✅' : '❌'}`);
  }

  // Check buttons container
  const buttonsDiv = await page.locator('section.hero div.flex').first();
  if (await buttonsDiv.count() > 0) {
    const buttonsAlign = await buttonsDiv.evaluate(el => window.getComputedStyle(el).justifyContent);
    console.log(`  Buttons justify-content: ${buttonsAlign} ${buttonsAlign === 'center' ? '✅' : '❌'}`);
  }

  console.log('\n🎨 BUTTON COLORS:');

  // Check button 1
  const btn1 = await page.locator('section.hero a[href="/cursos"]').first();
  if (await btn1.count() > 0) {
    const btn1Styles = await btn1.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
      };
    });
    console.log('  Botón "Ver Cursos":');
    console.log(`    color: ${btn1Styles.color}`);
    console.log(`    background: ${btn1Styles.backgroundColor}`);
  }

  // Check button 2
  const btn2 = await page.locator('section.hero a[href="/contacto"]').first();
  if (await btn2.count() > 0) {
    const btn2Styles = await btn2.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        borderWidth: styles.borderWidth,
      };
    });
    console.log('  Botón "Solicitar Información":');
    console.log(`    color: ${btn2Styles.color}`);
    console.log(`    background: ${btn2Styles.backgroundColor}`);
    console.log(`    border: ${btn2Styles.borderWidth} ${btn2Styles.borderColor}`);
  }

  // Screenshot
  await page.locator('section.hero').first().screenshot({
    path: 'hero-centered.png'
  });
  console.log('\n📸 Screenshot: hero-centered.png');
  console.log('   Navegador permanece abierto 30 segundos...');

  await page.waitForTimeout(30000);
  await browser.close();

  console.log('\n✅ VERIFICACIÓN COMPLETA');
})();
