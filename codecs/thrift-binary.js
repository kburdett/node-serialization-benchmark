const thrift = require('thrift');
const User = require('../gen-nodejs/user_types').User;

module.exports = {

    init: function () {
    },

    encode: function (obj) {
        const transport = new thrift.TBufferedTransport();
        const protocol = new thrift.TBinaryProtocol(transport);
        const user = new User(obj);
        user.write(protocol);
        const outBuffers = transport.outBuffers;
        const outCount = transport.outCount;
        const result = new Buffer(outCount);
        let pos = 0;
        outBuffers.forEach(function (buf) {
            buf.copy(result, pos, 0);
            pos += buf.length;
        });
        return result;
    },

    decode: function (data) {
        const transport = new thrift.TBufferedTransport();
        const protocol = new thrift.TBinaryProtocol(transport);
        data.copy(transport.inBuf, transport.writeCursor, 0);
        transport.writeCursor += data.length;
        const user = new User();
        user.read(protocol);
        return user;
    }

};
