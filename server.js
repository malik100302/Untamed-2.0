const express = require('express');

const app = express();

const fs = require('fs');

app.all('/', (req, res)=>{

   res.setHeader('Content-Type', 'text/html');

   res.write('<link href="https://fonts.googleapis.com/css?family=Roboto Condensed" rel="stylesheet"> <style> body {font-family: "Roboto Condensed";font-size: 22px;} <p>Hosting Active</p>');

   res.end();
})

function keepAlive(){
   app.listen(3000, ()=>{console.log("Server is online!")});
}

fs.readdir('img/banners', (err, files) => {
  files.forEach((file) => {
    console.log(file)
    app.get(`/banners/${file}`, function (req, res) {
        res.sendFile(__dirname + `/img/banners/${file}`);
    });
  })
})


module.exports = keepAlive;