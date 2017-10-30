const fs = require('fs');
const path = require('path');
const benchmark = require('benchmark');
const set = require('lodash/set');

async function load(dir) {
    const files = fs.readdirSync(dir);
    return await files.reduce(
        async (acc, file) => {
            const basename = path.basename(file, '.js');
            const modname = path.resolve(path.join(dir, basename));
            const codec = require(modname);
            if (codec.init) await codec.init();
            return set(await acc, [basename], codec);
        },
        {}
    );
}

async function main() {
    const codecs = await load('./codecs');
    const input = require('./input.json');
    suite('encode', codecs, (suite, name, codec) => suite.add(name, () => codec.encode(input)));
    suite('decode', codecs, (suite, name, codec) => {
        const encoded = codec.encode(input);
        suite.add(name, () => codec.decode(encoded));
    });
}

function suite(header, codecs, adder) {
    const suite = new benchmark.Suite;
    console.log(`### ${header} ###`);
    Object.entries(codecs).forEach(entry => adder(suite, ...entry));
    suite.on('cycle', event => console.log(event.target.toString()));
    suite.on('complete', () => console.log('Fastest is ' + suite.filter('fastest').map('name')));
    suite.run();
}

main().catch(err => console.log(err.toString()));
