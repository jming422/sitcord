const axios = require('axios').default;
const lodash = require('lodash');
const puppeteer = require('puppeteer-core');

const DISCORD_DEBUG_PORT = process.env.DISCORD_DEBUG_PORT;

const focusServerXPath = '//a[@aria-label="Focus Dev"]';

const connectXPath = '//div[@role="button" and contains(@aria-label, "General (voice channel)")]';
const disconnectXPath = '//button[@aria-label="Disconnect"]';

async function getWSEndpoint() {
  if (!DISCORD_DEBUG_PORT) {
    throw Error(
      `Environment variable DISCORD_DEBUG_PORT not found - you won't be able to connect to the Discord app without this!`
    );
  }
  const resp = await axios.get(`http://localhost:${DISCORD_DEBUG_PORT}/json/list`);
  return _(resp).get(['data', 0, 'websocketDebuggerurl']);
}

async function doInDiscord(fn) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await getWSEndpoint(),
  });
  const pages = await browser.pages();
  const page = pages[0];
  try {
    await page.waitForXPath(focusServerXPath, { timeout: 9000 });
    const [focusServerBtn] = await page.$x(focusServerXPath);
    await focusServerBtn.click();
    await fn(page);
  } finally {
    browser.disconnect();
  }
}

async function sit() {
  return await doInDiscord(async (page) => {
    await page.waitForXPath(connectXPath, { timeout: 3000 });
    const [connectBtn] = page.$x(connectXPath);
    await connectBtn.click();
  });
}

async function stand() {
  await doInDiscord(async (page) => {
    try {
      await page.waitForXPath(disconnectXPath, { timeout: 3000 });
      const [disconnectBtn] = page.$x(disconnectXPath);
      await disconnectBtn.click();
    } catch (err) {
      console.warn("Didn't detect the disconnect button, assuming we're already disconnected.");
    }
  });
}

module.exports = { sit, stand };
