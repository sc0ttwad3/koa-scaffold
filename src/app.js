const Koa = require('koa')
const Router = require('koa-router')
const joi = require('joi')
const validate = require('koa-joi-validate')

const app = new Koa();
const router = new Router();

module.exports = app;
