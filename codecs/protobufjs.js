const protobuf = require('protobufjs');
const util = require('util');

module.exports = {
    init: async function () {
        const load = util.promisify(protobuf.load);
        const root = await load('./user.proto');
        this._user = root.lookupType("benchmark.User");
    },
    encode: function (obj) {
        return this._user.encode(obj).finish();
    },
    decode: function (data) {
        return this._user.decode(data);
    },
};

