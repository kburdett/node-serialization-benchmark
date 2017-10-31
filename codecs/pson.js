const PSON = require('pson');

module.exports = {

    init: function () {
        const dict = [
            'name1234567',
            'age1234567',
            'sex1234567',
            'msg1234567'
        ];
        this._pson = new PSON.ProgressivePair(dict);
    },

    encode: function (obj) {
        return this._pson.encode(obj).buffer;
    },

    decode: function (data) {
        return this._pson.decode(data);
    }

};

