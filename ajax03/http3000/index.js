const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
// const axios = require("axios");
// 服务器代理 ：一次性所有接口都代理
const koaServerHttpProxy = require("koa-server-http-proxy");
let app = new Koa();
let router = new Router();

app.use(koaServerHttpProxy('/api', { target: 'http://localhost:4000', pathRewrite: { '^/api': '' } }))

app.use(static(__dirname + "/static"));

router.get("/", ctx => {
    ctx.body = "some value... at 3000";
});

// 代理转发；
// router.post("/getData", async ctx => {
//     let res = await axios({
//         method: "post",
//         url: "http://localhost:4000/getDataService"
//     })
//     console.log(res.data);
//     ctx.body = res.data;
// })

app.use(router.routes());
app.listen(3000);