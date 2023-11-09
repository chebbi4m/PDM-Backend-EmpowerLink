import multer,{diskStorage} from "multer";
import {join,dirname}from "path";
import {fileURLToPath}from "url";





const MIME_TYPES ={
    "image/jpg":"jpg",
    "image/jpeg":"jpeg",
    "image/png":"png",
};
export default multer({
    storage:diskStorage({
        destination:(req,file,callback)=>{
            const __dirname=dirname(fileURLToPath(import.meta.url));
            callback(null,join(__dirname,"../public/images"));
        },
        filname:(req,file,callback)=>{
            const name = file.orginalname.split(" ").join("_");
            const extension = MINE_TYPES[file.mimetype];
            callback(null,name+Date.now()+"."+extension);

        },

    }),
    Limits: 10 *1024 * 1024,
}).single("image")