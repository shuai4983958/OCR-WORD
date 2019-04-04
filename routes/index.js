var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/ocr", require("./pages/ocrWord/AipOcrClient.js"));  // AipOcrClient是Optical Character Recognition的node客户端



module.exports = router;
