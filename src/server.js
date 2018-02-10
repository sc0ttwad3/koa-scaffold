const chalk = require('chalk');

const server = require('./app')

/* Bootstrap Koa server */
const port = process.env.PORT || '4000';

async function bootstrap() {
  // app established to function as HTTP server
  await server.listen(port, () => console.log(chalk.bold.blue(`Koa server listening on ${port} ...`)));
}

bootstrap();
