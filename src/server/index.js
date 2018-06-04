const express = require('express');
var mongoose = require('mongoose');

const app = express();
const port = 8000;

var dbSupport = require('./DBSupport');
var urlTools = require('./UrlTools');

app.use(express.static(__dirname +'./../../')); //serves the index.html

app.use((request, response, next) => {
    //console.log(request.headers)
    next();
});

app.use(express.urlencoded({extended: true}));
app.get('/', (request, response) => {
    //throw new Error('oops')
    response.send('Hello this a simple express server');
});

app.get('/decode/:shortUrl', function (request, response, next) {
    console.debug( request.params.shortUrl);
    let shortUrl = request.params.shortUrl;
    let database = new dbSupport();

    database.findById(urlTools.decode(shortUrl), res => {
        if (res.longUrl) {
            response.redirect(301, res.longUrl);
            return;
        } else {
            response.send({
                status: 404,
                statusTxt: 'OK'
            });
            return;
        }
    })

});

app.get('/decode/:shortUrl/*', function (request, response, next) {
    console.log( request.params.shortUrl);
    response.send('Hello I got your decode request *');
});

app.use(express.json({extended: true}));
app.use((request, response, next) => {
    // allow cross domain
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post('/shorten', function (request, response, next) {
    console.log(request.body.long_url);
    var urlData = request.body.long_url;

    let database = new dbSupport();

    database.storeUrl(urlData, function(res) {
        response.send({
            url: urlData,
            shortUrl: urlTools.encode(res.shortUrl),
            status: 200,
            statusTxt: 'OK'
        });
    });
});

app.use((err, request, response, next) => {
    // log the error, for now just console.log
    console.log(err);
    response.status(500).send('Something broke!');
});


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log('server is listening on ' + port);
});



