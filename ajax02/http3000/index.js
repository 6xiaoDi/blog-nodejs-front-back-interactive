const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
let app = new Koa();
let router = new Router();
app.use(static(__dirname + "/static"));
router.get("/", ctx => {
    ctx.body = "some value... at 3000";
});
router.post("/test", ctx => {
    // 设置cookie；
    ctx.cookies.set("name", "zhangsan", {
        maxAge: 3600 * 1000   //毫秒（过期时间：1个小时）
    })
    ctx.body = {
        name: "张三"
    }
})
app.use(router.routes());
app.listen(3000);