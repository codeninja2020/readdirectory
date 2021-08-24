

 // LATEST USE THIS WORKING


var express = require('express'),
    cors = require('cors')
    ls = require('ls'), // modified library
    async = require('async'),
    path = require('path'),
    fs = require('fs'),
    filesize = require("filesize"),
    moment = require('moment'); 


    const app = express()

//onefifty
//twohundred
//onefifty
//onetwentyfife
//1,3,5,8,10,20,30,40,50,many
//source library to read large directory https://github.com/Zlitus/large-directory-readdir

var filesArray = [] 

// Request http://localhost:4000/?directory=new 

app.get('/', async(req, res) => {

  let directoryName = ls('./'+req.query.directory+'/*');

  console.log(directoryName.length)

  var directorySize= directoryName.length 


  try {

     for (var file of directoryName) {
    
      filesArray.push(getFileData(file));

      if(directorySize == filesArray.length){
        
       res.setHeader('Access-Control-Allow-Origin', '*');
       res.setHeader(
              'Access-Control-Allow-Headers',
              'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            );
       res.setHeader('Access-Control-Allow-Methods', '*');
       res.json(filesArray)
       res.end();

       //reset variables
       directoryName =null;
       filesArray = [ ]; 
      }

    }
      
  } 
  catch (error){
    console.log(error)
  }

})

  function getFileData(file){

    var filename = file.name; 

    var fullpath = file.full; 

    var filetype =file.type; 

    var fileSizeInMb = filesize(file.size, {round: 0});

    var fileextension = file.extension; 

    var date = moment(file.date).format('L');

    // check permissions 
    var permissions ; 
    try {
        fs.accessSync(fullpath, fs.constants.R_OK | fs.constants.W_OK); 
        permissions = "read/write"
      } catch (err) {
        console.error('no access!');
      }
    var myfile = {name:filename,path:fullpath,type:filetype,size:fileSizeInMb,extension:fileextension,created:date,permission:permissions};
    return myfile;
  }


app.use(cors());
app.listen(4000);
console.log('Running aAPI server at http://localhost:4000/');