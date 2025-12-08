import { chromium } from 'playwright'

const URL = 'http://localhost:3002/auth/login'

const run = async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const res = await page.goto(URL, { waitUntil: 'networkidle' })

  await page.waitForSelector('text=Iniciar Sesión', { timeout: 8000 })
  await page.waitForSelector('label:has-text("Correo electrónico")')
  await page.waitForSelector('label:has-text("Contraseña")')

  await page.screenshot({ path: '/tmp/cms-login.png', fullPage: true })

  console.log(JSON.stringify({ status: res?.status(), url: page.url(), screenshot: '/tmp/cms-login.png' }, null, 2))
  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
