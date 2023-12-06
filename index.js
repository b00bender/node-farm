const http = require('http');
const fs = require('fs');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplates');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  let output;

  switch (pathname) {
    case '/':
    case '/overview':
      res.writeHead(200, { 'Content-type': 'text/html' });
      const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
      output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
      res.end(output);
      break;

    case '/product':
      res.writeHead(404, { 'Content-type': 'text/html' });
      if (query.id) {
        const product = dataObj[query.id];
        output = replaceTemplate(tempProduct, product);
        res.end(output);
      } else {
        res.end('<h1>This is Products</h1>');
      }
      break;

    case '/api':
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(data);
      break;

    default:
      fs.readFile('./templates/template-not-found.html', 'utf-8', (err, data) => {
        if (err) return err;
        res.writeHead(404, {
          'Content-type': 'text/html',
          'my-own-header': 'not-found',
        });
        res.end(data);
      });
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log(`Listening on requests on port 8000`);
});
