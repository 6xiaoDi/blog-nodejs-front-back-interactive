const Koa = require("koa");
const static = require("koa-static");
const Router = require("koa-router");
let app = new Koa();
app.use(static(__dirname+"/static"));
let router = new Router();
router.get("/",(ctx,next)=>{
    ctx.body = "hello";
})
app.use(router.routes());
app.listen(3000);