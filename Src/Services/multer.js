import multer from 'multer'

export const fileValidation = {
    image:['image/jpeg','image/png','image/webp','image/svg+xml'],
    file:['application/pdf'],
    excel:['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

}

function fileUpload(customValidation =[]){
    const storage = multer.diskStorage({});
    function fileFilter(req,file,cb){
        if(customValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb("invalid format",false);
        }
    }
    const upload = multer({fileFilter,storage});
    return upload;
}

export default fileUpload;
