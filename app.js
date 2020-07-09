var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose    =   require('mongoose');    
var userModel   =   require('./models/user');    
var bodyParser  =   require('body-parser');    
var QRCode      =   require('qrcode');  

//connect to db    
mongoose.connect('mongodb://localhost:27017/qrdemo', {useNewUrlParser:true})
  .then(()=>{
    console.log('connected to db');
  })    
  .catch((err)=>{
    console.log(err);
  });


var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//fetch data from the reuqest    
app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res)=>{
  userModel.find((err, data)=>{
    if(err){
      console.error(err);
    }
    else{
      if(data != ''){
        var temp = [];
        for (let i = 0; i < data.length; i++) {
          var name = {
            data: data[i].name
          };
          temp.push(name);
          var phone = {
            data: data[i].phone
          };
          temp.push(phone);
        }
        // Returns a Data URI containing a representation of the QR Code image.
        QRCode.toDataURL(temp, {errorCorrectionLevel: 'H'},(err, url)=>{
          if(err){
            console.error(err);
          }
          else{
            console.log(url);    
            res.render('home',{data:url});
          }
        });
      }
      else{
        res.render('home', {data:''});
      }
    }
  });
});

app.post('/', (req, res)=>{
  var userr = userModel({
    name: req.body.name,
    phone: req.body.phone
  });
  userr.save((err, data)=>{
    if(err){
      console.error(err);
    }
    else{
      res.redirect('/');
    }
  });
});


module.exports = app;
