const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

var fs = require("fs");


var unirest = require("unirest");

var reque = unirest("POST", "https://eastus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/5a09f609-1d9e-4d92-bb22-21a35261418f/classify/iterations/Iteration2/image");


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
    for(var attributename in resp.body["predictions"]){
      aux=resp.body["predictions"][attributename]["probability"],
      aux=parseFloat(aux)
      if (prob<aux){
        prob=aux,
        value=resp.body["predictions"][attributename]["tagName"]
      };
    }
    return res.json({number : value});
  });
});
  





module.exports = routes;
