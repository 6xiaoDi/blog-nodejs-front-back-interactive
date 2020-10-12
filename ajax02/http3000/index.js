const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
let app = new Koa();
let router = new Router();
app.use(static(__dirname + "/static"));
router.get("/", ctx => {
    ctx.body = "some value... at 3000";
});
router.get("/test", ctx => {
    ctx.body = {
        name: "张三"
    }
})
app.use(router.routes());
app.listen(3000);