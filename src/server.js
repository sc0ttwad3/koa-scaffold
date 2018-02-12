// Babel: require HOOK will bind itself to node’s require
//        and automatically compile files on the fly
require('babel-register')

const chalk = require('chalk');
const Koa = require('koa')
const Router = require('koa-router')
const Boom = require('boom')
const joi = require('joi')
const validate = require('koa-joi-validate')

const app = new Koa();
const router = new Router();
const port = process.env.PORT || '4000';

/* Setup middle ware functions */
// x-response-time and logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// set permissive CORS header
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  await next();
});

/*
app.use(router.routes())
   .use(router.allowedMethods({
     throw: true,
     notImplemented: () => new Boom.notImplemented(),
     methodNotAllowed: () => new Boom.methodNotAllowed()
   }));
*/

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

// app.listen(4000);
app.listen(port, () => console.log(chalk.bold.blue(`Koa server listening on ${port} ...`)));

