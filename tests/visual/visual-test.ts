import { test, expect, describe } from 'vitest'
import puppeteer from 'puppeteer'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import fs from 'fs'
import path from 'path'

const BASELINES_DIR = path.join(__dirname, 'baselines')
const DIFFS_DIR = path.join(__dirname, 'diffs')
const UPDATE_BASELINES = process.env.UPDATE_BASELINES === 'true'

// Ensure directories exist
if (!fs.existsSync(BASELINES_DIR)) fs.mkdirSync(BASELINES_DIR, { recursive: true })
if (!fs.existsSync(DIFFS_DIR)) fs.mkdirSync(DIFFS_DIR, { recursive: true })

async function captureScreenshot(url: string, name: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })
  await page.goto(url, { waitUntil: 'networkidle0' })
  const screenshot = await page.screenshot() as Buffer
  await browser.close()
  return screenshot
}

async function compareScreenshots(name: string, current: Buffer): Promise<number> {
  const baselinePath = path.join(BASELINES_DIR, `${name}.png`)

  if (UPDATE_BASELINES || !fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, current)
    return 0
  }

  const baseline = PNG.sync.read(fs.readFileSync(baselinePath))
  const currentPng = PNG.sync.read(current)
  const { width, height } = baseline
  const diff = new PNG({ width, height })

  const numDiffPixels = pixelmatch(
    baseline.data,
    currentPng.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  )

  if (numDiffPixels > 0) {
    fs.writeFileSync(path.join(DIFFS_DIR, `${name}-diff.png`), PNG.sync.write(diff))
  }

  return numDiffPixels
}

describe.skip('Visual Regression Tests', () => {
  // Skip until pages are built - remove .skip when ready
  test('homepage matches baseline', async () => {
    const screenshot = await captureScreenshot('http://localhost:3000', 'homepage')
    const diffPixels = await compareScreenshots('homepage', screenshot)
    expect(diffPixels).toBe(0)
  })

  test('dashboard matches baseline', async () => {
    const screenshot = await captureScreenshot('http://localhost:3000/dashboard', 'dashboard')
    const diffPixels = await compareScreenshots('dashboard', screenshot)
    expect(diffPixels).toBe(0)
  })
})
