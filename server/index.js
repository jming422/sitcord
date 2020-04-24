const Koa = require('koa');
const Router = require('@koa/router');

const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const respond = require('koa-respond');

function sitFn() {
  console.log('Sitting!');
}

function standFn() {
  console.log('Standing!');
}

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => ctx.ok('Pong!'));
router.post('/', (ctx) => {
  const body = ctx.request.body;
  console.log(`Got body: ${JSON.stringify(body)}`);

  switch (body.sitting) {
    case true:
      sitFn();
      break;
    case false:
      standFn();
      break;
    default:
      console.warn('What?');
      return ctx.badRequest();
  }

  return ctx.noContent();
});

app.use(logger());
app.use(bodyParser());
app.use(respond());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 12345;
const server = app.listen(PORT, () => console.log(`listening on port ${port}`));
