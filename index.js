const jsonServer = require('json-server');

const server = jsonServer.create();

// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults());

const router = jsonServer.router('db.json');
server.use(router);


console.log('Listening at 3000');
server.listen(3000);
