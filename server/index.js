require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');

const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const respond = require('koa-respond');

const { sit, stand } = require('./automateDiscord');

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => ctx.ok('Pong!'));
router.post('/', async (ctx) => {
  const body = ctx.request.body;
  console.log(`Got body: ${JSON.stringify(body)}`);
  try {
    switch (body.sitting) {
      case true:
        await sit();
        break;
      case false:
        await stand();
        break;
      default:
        console.warn('What?');
        return ctx.badRequest();
    }
  } catch (err) {
    console.error(err);
    return ctx.internalServerError();
  }

  return ctx.noContent();
});

app.use(logger());
app.use(bodyParser());
app.use(respond());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.SITCORD_PORT || 12345;
const server = app.listen(PORT, () => console.log(`listening on port ${port}`));
