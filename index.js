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

    console.log('### encoded size ###');
    Object.entries(codecs).forEach(([name, codec]) => {
        const encoded = codec.encode(input);
        console.log(`${name}: ${encoded.length} bytes`);
    });

    console.log();
    console.log('### encode ###');
    suite(codecs, (suite, name, codec) => suite.add(name, () => codec.encode(input)));

    console.log();
    console.log('### decode ###');
    suite(codecs, (suite, name, codec) => {
        const encoded = codec.encode(input);
        suite.add(name, () => codec.decode(encoded));
    });


}

function suite(codecs, adder) {
    const suite = new benchmark.Suite;
    Object.entries(codecs).forEach(entry => adder(suite, ...entry));
    suite.on('cycle', event => console.log(event.target.toString()));
    suite.on('complete', () => console.log('Fastest is ' + suite.filter('fastest').map('name')));
    suite.run();
}

main().catch(err => console.log(err.toString()));
