require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const logger = require('koa-logger');
const respond = require('koa-respond');

const { sit, stand } = require('./automateDiscord');

const app = new Koa();
const router = new Router();

const API_KEY = process.env.SITCORD_API_KEY;
const PORT = process.env.SITCORD_PORT || 12345;

let discordConnected = false;

router.get('/', (ctx) => ctx.ok('Pong!'));

router.post('/sit', async (ctx) => {
  try {
    if (!discordConnected) {
      console.log(`Hit /sit, not previously connected. Connecting...`);
      await sit();
      discordConnected = true;
      return ctx.ok(true);
    } else {
      console.log(`Hit /sit, already connected. Doing nothing.`);
      return ctx.ok(false);
    }
  } catch (err) {
    console.error(err);
    return ctx.internalServerError();
  }
});

router.post('/stand', async (ctx) => {
  try {
    if (discordConnected) {
      console.log(`Hit /stand, already connected. Disconnecting...`);
      await stand();
      discordConnected = false;
      return ctx.ok(true);
    } else {
      console.log(`Hit /stand, already disconnected. Doing nothing.`);
      return ctx.ok(false);
    }
  } catch (err) {
    console.error(err);
    return ctx.internalServerError();
  }
});

app.use(logger());
app.use(respond());
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(PORT, '0.0.0.0', () => console.log(`listening on http://0.0.0.0:${PORT}`));
