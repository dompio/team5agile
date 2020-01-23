const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.status(200).send('ok');
  console.log('[GET] /');
});


var server = app.listen(3000, () => {
  var port = server.address().port;
  console.log('Example app listening at port %s', port);
});

module.exports = server;
   