const mongoose=require('mongoose');
//importing dotenv module;
require('dotenv').config();
//*url
const mongoUrl_local=process.env.MongoUrl_local;//ye abbhi tk git hub pr push nhi hua he
//*acsessing .env var.;
//const mongoUrl=process.env.Mongourl;
mongoose.connect(mongoUrl_local)
const db=mongoose.connection;
db.on('connected', () => {
    console.log("it is connected");
});
db.on('diconnected', () => { 
    console.log("it is diconnected");
});
db.on('error', (err) => {
    console.log("there is an error");
});
module.exports=db;
