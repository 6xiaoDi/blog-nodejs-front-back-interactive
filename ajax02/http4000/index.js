const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
let app = new Koa();
let router = new Router();
app.use(static(__dirname+"/static"));
router.get("/",ctx=>{
    ctx.body = "some value... at 4000";
});
router.post("/getData",ctx=>{
    console.log("请求过来了");
    // 允许跨域；允许地址
    ctx.set("Access-Control-Allow-Origin","*")
    ctx.body = {
        info:"I am at 4000"
    };
});
app.use(router.routes());
app.listen(4000);