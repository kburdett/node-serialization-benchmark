const avro = require('avsc');

module.exports = {

    init: function () {
        this._user = avro.Type.forSchema({
            type: 'record',
            name: 'User',
            fields: [
                {name: 'name1234567', type: 'string'},
                {name: 'age1234567', type: 'int'},
                {name: 'sex1234567', type: 'int'},
                {name: 'msg1234567', type: 'string'}
            ]
        });
    },

    encode: function (obj) {
        try {
            return this._user.toBuffer(obj);
        } catch (err) {
            console.error(err.toString());
        }
    },

    decode: function (data) {
        return this._user.fromBuffer(data);
    }

};
