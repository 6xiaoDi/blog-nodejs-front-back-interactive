const axios = require("./static/myaxios.js");
axios({
    method:"get",
    url:"http://localhost:4000/axios"
}).then(res=>{
    console.log("结果：",res);
})