require('dotenv').load();
const express = require('express');
var path = require('path');
const app = express();
const port = process.env.nodeServerPort || 3000;

var dbSupport = require('./DBSupport');
var urlTools = require('./UrlTools');

app.use(express.urlencoded({extended: true}));

app.get(['/:shortUrl', '/decode/:shortUrl', '/decode/:shortUrl/*'], (request, response, next) => {
    console.debug( '[ExpressJS decode] '+request.params.shortUrl);

    let shortUrl = request.params.shortUrl;

    if (shortUrl.indexOf('?e') > -1) {
        response.redirect(301, '/');
        return;
    }

    let database = new dbSupport();

    if (!shortUrl) {
        next();
    } else {

        database.findById(urlTools.decode(shortUrl), res => {
            console.log('[ExpressJS decode]' +res);
            if (res.longUrl) {
                response.redirect(301, res.longUrl);
                return;
            } else {
                response.sendFile(path.join(__dirname + '/error.html'));
                return;
            }
        })
    }
});

// show input page
app.use(express.static(__dirname +'./../../')); //serves the index.html

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

    console.log('[Express] server is listening on ' + port);
});



