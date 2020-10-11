const Koa = require("koa");
const static = require("koa-static");
const Router = require("koa-router");
// 接收post参数及上传的文件；
const koaBody = require("koa-body");
let app = new Koa();
let router = new Router();
app.use(static(__dirname+"/static"));
app.use(koaBody({
    multipart:true
}))
router.get("/",ctx=>{
    ctx.body = "some value";
})
app.use(router.routes());
app.listen(3000);