require('dotenv').load();
const connectionString = process.env.mongoConnectionString || 'mongodb://localhost:27017';
var mongoose = require('mongoose');

// make create/destroy configurable

var countersSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    count: { type: Number, default: 0 }
});

var Counter = mongoose.model('Counter', countersSchema);

var urlSchema = new mongoose.Schema({
    _id: {type: Number},
    url: '',
    created_at: ''
});

urlSchema.pre('save', function(next) {
    console.log('[DBSupport] Running pre-save');
    var doc = this;
    Counter.findByIdAndUpdate({ _id: 'url_count' }, { $inc: { count: 1 } }, function(err, counter) {
        if(err) return next(err);
        //console.log(counter);
        //console.log(counter.count);
        doc._id = counter.count;
        doc.created_at = new Date();
        next();
    });
});

var URL = mongoose.model('URL', urlSchema);

promise = mongoose.connect(connectionString, {
});

promise.then(function(db) {
    console.log('[DBSupport] Connected!');
    URL.remove({}, function() {
        console.log('[DBSupport] URL collection removed');
    });
    Counter.remove({}, function() {
        console.log('[DBSupport] Counter collection removed');
        var counter = new Counter({_id: 'url_count', count: 10000});
        counter.save(function(err) {
            if(err) return console.error(err);
            console.log('[DBSupport] Counter inserted');
        });
    });
});


class DBSupport {
    findById(id, callback) {
        URL.findOne({_id: id}, function (err, doc) {
            if (doc) {
                callback({status: 301, longUrl: doc._doc.url})
            } else {
                callback({status: 404})
            }
        });
    }

    /**
     * Store minified URL in Mongo
     * @param theUrl
     * @param callback
     */
    storeUrl(theUrl, callback) {

        URL.findOne({url: theUrl}, function (err, doc) {
            if (doc) {
                console.log('[DBSupport] entry found in db');
                callback({
                    url: theUrl,
                    shortUrl: doc._id,
                    status: 200,
                    statusTxt: 'OK'
                    });
            } else {
                console.log('[DBSupport] entry NOT found in db, saving new');
                var url = new URL({
                    url: theUrl
                });
                url.save(function (err) {
                    if (err) return console.error(err);
                    callback({
                        url: theUrl,
                        shortUrl: url._id,
                        status: 200,
                        statusTxt: 'OK'
                    });
                });
            }
        });
    }
}

module.exports = DBSupport;