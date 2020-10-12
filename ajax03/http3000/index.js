const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
const axios = require("axios");
let app = new Koa();
let router = new Router();
app.use(static(__dirname + "/static"));

router.get("/", ctx => {
    ctx.body = "some value... at 3000";
});

// 代理转发；
router.post("/getData", async ctx => {
    let res = await axios({
        method: "post",
        url: "http://localhost:4000/getDataService"
    })
    console.log(res.data);
    ctx.body = res.data;
})

app.use(router.routes());
app.listen(3000);