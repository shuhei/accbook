/* eslint no-console: "off" */

import express from 'express';
import serveStatic from 'serve-static';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(serveStatic('public'));

const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
    return;
  }

  const { address, port } = server.address();
  console.log('Listening at %s:%s', address, port);
});
