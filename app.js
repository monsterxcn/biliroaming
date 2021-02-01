const express = require('express');
const app = express();
app.disable("x-powered-by");
const config = require('./Config/config')
const net = require('./Config/net');

// app.get('/pgc/player/api/playurl', async (req, res, next) => {
//   data = await net.playurl(req.query)
//   res.send(data)
// });
app.get('/intl/gateway/v2/ogv/playurl', async (req, res, next) => {
  data = await net.th_playurl(req.query)
  res.send(data)
});
app.get('/intl/gateway/v2/app/subtitle', async (req, res, next) => {
  data = await net.th_subtitle(req.query)
  res.send(data)
});
app.get('/intl/gateway/v2/app/search/type', async (req, res, next) => {
  data = await net.th_search(req.query)
  res.send(data)
});
// app.get('/pgc/player/web/playurl', async (req, res, next) => {
//   data = await net.web_playurl(req.query)
//   res.set({
//     'Access-Control-Allow-Origin': 'https://www.bilibili.com',
//     'Access-Control-Allow-Credentials': 'true'
//   })
//   res.send(data)
// });

app.use(function (req, res) {
  res.status(404).json({
    "code": -400,
    "message": "请求错误,没有此接口"
  })
})
app.use(function (err, req, res, next) {
  console.error('Error:', err);
  res.status(500).send(err.message);
});

const server = app.listen(config.port, () => {
  let port = server.address().port;
  console.log(`服务已启动,端口为: ${port}`);
});