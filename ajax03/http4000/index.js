const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
let app = new Koa();
let router = new Router();
app.use(static(__dirname+"/static"));

router.get("/",ctx=>{
    ctx.body = "some value... at 4000";
});

router.post("/getDataService",ctx=>{
    ctx.body = {
        info:"4000端口数据"
    }
})

app.use(router.routes());
app.listen(4000);