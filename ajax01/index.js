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
    ctx.body = "some value..."
})
router.get("/xml",ctx=>{
    // ctx.body = "some xml value..."
    // 设置头部
    ctx.set("content-type","text/xml");
    ctx.body = `<?xml version='1.0' encoding='utf8' ?>
                    <books>
                        <nodejs>
                            <name>nodjs</name>
                            <price>$5.7</price>
                        </nodejs>
                        <vuejs>
                            <name>vue从入门到精通</name>
                            <price>$5.8</price>
                        </vuejs>
                    </books>
                `
})
app.use(router.routes());
app.listen(4000);