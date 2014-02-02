var request = require('superagent');

module.exports = patchStream

function patchStream (resourceUrl) {

    function ondata(end, patch) {
   			console.log('send', patch)
        request.patch(resourceUrl)
            .set('Content-Type', 'application/json-patch')
            .set('Accept', 'application/json')
            .send(JSON.stringify([patch]))
            .end(function (err, res) {
                respond(err, res.body);
            })
    }

    function respond(err, item) {
        callbacks.forEach(function (cb) {
            cb(err, item)
        })
    }

    var callbacks = [];
    function responseSource(end, callback) {
        if (end) return callbacks.splice(callbacks.indexOf(callback), 1);
        callbacks.push(callback);
    }

    function patchSink (source) {
        source(null, ondata);
        return responseSource;
    }
    return patchSink;
}
