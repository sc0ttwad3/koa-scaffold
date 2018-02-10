const chalk = require('chalk')
const Koa = require('koa')
const Router = require('koa-router')
const joi = require('joi')
const validate = require('koa-joi-validate')

const app = new Koa();
const router = new Router();

// log each request to the console
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();

  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// set permissive CORS header
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  return next;
})

app.use(router.routes())
   .use(router.allowedMethods());

app.on('error', e => {
  console.error(chalk.bold.red('Server Error', e));
});

/*
router.get('/', async (ctx, next) => {
  const {term, ofsset} = ctx.request.query;
  // ctx available
  // ctx.body = await Some_Function()
})
*/


module.exports = app;
