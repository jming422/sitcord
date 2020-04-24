require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const logger = require('koa-logger');
const respond = require('koa-respond');

const { sit, stand } = require('./automateDiscord');

const app = new Koa();
const router = new Router();

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

const PORT = process.env.SITCORD_PORT || 12345;
const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));
