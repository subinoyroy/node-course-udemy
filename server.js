const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(txt)=>{
    return txt.toUpperCase();
});

app.set('view engine','hbs');

app.use((req, res, next)=>{
    var now = new Date();
    fs.appendFile('server.log',`${now.toString()} : ${req.method} : ${req.url} : ${req.path}\n`,(err)=>{
        if(err){
            console.log("Error: Can not append to server.log","Details: ",err);
        }
    });
    next();
});

app.use((req, res, next)=>{
    fs.readFile('./currentsettings.json',(err, data)=>{
        if(!err){
            var settings = JSON.parse(data);
            if(settings.currentState==='maintenance'){
                res.render('maintenance');
            }else{
                next();
            }
        }
    });
})

app.use(express.static(`${__dirname}/public`));

app.get('/',(request, response)=>{
    //console.log(request);
    // response.set('Content-Type', 'application/json');
    response.render('home',{
        userName: request.query.name,
        headerText: "Home Page"
    })
});

app.get('/about',(request,response)=>{
    response.render('about.hbs',{
        headerText: "About Page"
    })
});

app.get('/bad',(request,response)=>{
    // response.set('Content-Type','application/json');
    response.send({
        errorMessage: "Bad request"
    })
});

app.listen(3000,()=>{
    console.log("Server started on port 3000");
});