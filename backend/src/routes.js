const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

var request = require("request");
var fs = require("fs");


var unirest = require("unirest");

var reque = unirest("POST", "https://eastus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/5a09f609-1d9e-4d92-bb22-21a35261418f/classify/iterations/0.0/image");


//todo: no post acho que não precisa retornar nada
routes.post("/posts", multer(multerConfig).single("file"), (req, res) => {

  var prob=0, value, aux=0;

  reque.headers({
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    "Prediction-Key": "550bf889ded049ada4a1149ed0e94e76"
  });
  
  reque.multipart([
    {
      "body": fs.createReadStream("C:\\Users\\leove\\Documents\\mnist\\backend\\tmp\\uploads\\digit.png")
    }
  ]);
  
  reque.end(function (resp) {
    if (resp.error) throw new Error(resp.error);
  
    console.log(resp.body["iteration"]);



    for(var attributename in resp.body["predictions"]){
      aux=resp.body["predictions"][attributename]["probability"],
      aux=parseFloat(aux),
      console.log('1---' + aux)
      console.log('2---' + resp.body["predictions"][attributename]["tagName"])
      if (prob<aux){
        prob=aux,
        value=resp.body["predictions"][attributename]["tagName"]
        console.log('3---' + value)
      };
    }

    console.log('4---' + value);
    return res.json({number : value});
  });
});
  





module.exports = routes;


