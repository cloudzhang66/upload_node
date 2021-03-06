const express = require("express")
const fs = require("fs")
const path = require("path")

const app = express()
const port = 3000;
app.listen(port,()=>{console.log("listening on "+port+"...");
})

app.use(express.static("./public"))

const multer = require("multer")
const uploadDir = "public/upload/";
let objMulter = multer({ dest: './'+uploadDir });

app.use(objMulter.any());

app.post("/upload",(req,res)=>{
    // console.log(req.files);
    req.files.forEach(f=>{
        console.log(f)
        let oldFile = f.path;
        let newFile = uploadDir + f.originalname
        fs.renameSync(oldFile , newFile)
    })
    res.redirect("/");
})
const hn = "1";
app.get("/", (req, res)=>{
    let html = fs.readFileSync("./list.html", "utf-8");
    let files = fs.readdirSync(uploadDir);
    console.log(files)
    let links = "";

    files.forEach(x=>{
        if(!fs.statSync(uploadDir+x).isDirectory()){
            links += '<h3><a target="_blank" href="./upload/'+x+'">'+x+'</a></h3>'
        }
    });
    console.log(links)
    html = html.replace('<!-- filelist -->', links);
    res.send(
        html
    );
});
app.get("/clear", (req, res)=>{
    if(!fs.existsSync(uploadDir+"bak")){
        fs.mkdirSync(uploadDir+"bak");
    }
    fs.readdirSync(uploadDir).forEach(f=>{
        if(fs.statSync(uploadDir+f).isDirectory()){

        }else{
            fs.renameSync(uploadDir+f, uploadDir+"bak/"+f);
        }
    });
    res.redirect("/");
})
