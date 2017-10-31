const msgpack = require('msgpack-lite');

module.exports = {

    init: function () {
    },

    encode: function (obj) {
        return msgpack.encode(obj);
    },

    decode: function (data) {
        return msgpack.decode(data);
    }

};
