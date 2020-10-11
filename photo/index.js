const Koa = require("koa");
const fs = require("fs");
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

// 上传接口
router.post("/upload",ctx=>{
    let filepath = ctx.request.files.img.path;
    // 判断是否有下载目录，否则创建目录
    if(!fs.existsSync("static/uploads/")){
        fs.mkdirSync("static/uploads/");
    }
    // 流方式转存 ； 文件路径；
    let rs =  fs.createReadStream(filepath);
    rs.pipe(fs.createWriteStream("static/uploads/"+ctx.request.files.img.name));
    ctx.body ={
        info:"转存成功",
        status:1
    }
})
app.use(router.routes());
app.listen(3000);