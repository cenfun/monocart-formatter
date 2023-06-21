// starfall-cli config
// https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');

const lzPackage = (name, Util) => {
    console.log(`generating ${name}.js ...`);
    const workerPath = path.resolve(__dirname, `../packages/${name}/dist/monocart-${name}.js`);
    if (!fs.existsSync(workerPath)) {
        Util.logRed(`please build ${name} first, not found build ${workerPath}`);
        return 0;
    }
    const buf = fs.readFileSync(workerPath);
    const { deflateSync } = require('lz-utils');
    const workerData = `module.exports = '${deflateSync(buf)}';`;
    Util.writeFileSync(path.resolve(`.temp/${name}.js`), workerData);
};

const cpPackage = (name, Util) => {
    console.log(`generating ${name}.js ...`);
    const fromPath = path.resolve(__dirname, `../packages/${name}/dist/monocart-${name}.js`);
    if (!fs.existsSync(fromPath)) {
        Util.logRed(`please build ${name} first, not found build ${fromPath}`);
        return 0;
    }
    const toPath = path.resolve(__dirname, `../packages/formatter/dist/monocart-${name}.js`);
    fs.cpSync(fromPath, toPath);

};

module.exports = {

    build: {

        vendors: ['formatter'],

        before: (item, Util) => {
            console.log('before build');

            if (item.production) {
                item.devtool = false;
            }

            if (item.name === 'formatter') {
                lzPackage('formatter-worker', Util);
            }

            return 0;
        },

        after: (item, Util) => {
            // console.log('after build');

            if (item.name === 'formatter') {
                cpPackage('formatter-node', Util);
            }


            return 0;
        }


        // afterAll: (option, Util) => {
        //     console.log('after build all');
        //     return 0;
        // }
    }

};
