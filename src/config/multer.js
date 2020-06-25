const multer = require('multer');
const path = require ('path');
const crypto = require ('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const storageTypes = {
 local: multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads' ));
    },
 //criando uma quantidade e de caracter para imagem ter o nome único
    filename:(req, file, cb )=>{
     crypto.randomBytes(16,(err,hash)=>{
         if (err) cb(err);

         file.key= `${hash.toString('hex')}-${file.originalname}`;
         
         cb(null, file.key);

        });
    },
 }),
  s3: multerS3({
   s3: new aws.S3(),
   bucket:'uploadexemple44',
   contentType:multer.AUTO_CONTENT_TYPE, //ler o tipo de arquivo e não força o download 
   acl:'public-read', //todos os arquivos que fizer upload pode ser publico
   key:(req, file, cb)=>{
    crypto.randomBytes(16,(err,hash)=>{
        if (err) cb(err);

        const fileName= `${hash.toString('hex')}-${file.originalname}`;
        
        cb(null, fileName);

       });
   }
 }),
};

module.exports = {
   dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads' ),
   storage: storageTypes['s3'],  
   limits:{// Informa o limite do tamanho do arquivo
   fileSize: 2 * 1024 * 1024
},
fileFilter: (req, file, cb )=>{
    const allowedMimes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/gif',

    ];

    if (allowedMimes.includes(file.mimetype)){
        cb(null, true);
    }else{
     cb(new Error("Invalid file type."));
    }
},


};