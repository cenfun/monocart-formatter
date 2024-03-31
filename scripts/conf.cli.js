// starfall-cli config
// https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');

const lzPackage = (name, Util) => {
    Util.logCyan(`generating ${name}.js ...`);
    const workerDistDir = path.resolve(__dirname, `../packages/${name}/dist/`);
    const workerPath = path.resolve(workerDistDir, `monocart-formatter-${name}.js`);
    if (!fs.existsSync(workerPath)) {
        Util.logRed(`please build ${name} first, not found build ${workerPath}`);
        return 0;
    }
    const buf = fs.readFileSync(workerPath);
    const { deflateSync } = require('lz-utils');
    const workerData = `module.exports = '${deflateSync(buf)}';`;
    Util.writeFileSync(path.resolve(workerDistDir, `monocart-formatter-${name}.lz.js`), workerData);
};

module.exports = {

    test: {
        coverageProvider: 'v8'
    },

    build: {

        vendors: ['formatter', 'worker'],

        before: (item, Util) => {
            console.log('before build');

            if (item.production) {
                item.devtool = false;
            }

            return 0;
        },

        after: (item, Util) => {
            // console.log('after build');

            if (item.name === 'formatter') {

                const filename = 'monocart-formatter.js';

                Util.logCyan(`copy ${filename} ...`);
                fs.cpSync(
                    path.resolve(__dirname, `../packages/${item.name}/dist/${filename}`),
                    path.resolve(__dirname, `../dist/${filename}`)
                );

            } else if (item.name === 'worker-browser') {

                lzPackage(item.name, Util);

            } else if (item.name === 'worker-node') {

                lzPackage(item.name, Util);

                const filename = `monocart-formatter-${item.name}.lz.js`;

                Util.logCyan(`copy ${filename} ...`);
                fs.cpSync(
                    path.resolve(__dirname, `../packages/${item.name}/dist/${filename}`),
                    path.resolve(__dirname, `../dist/${filename}`)
                );

            }

            return 0;
        },

        afterAll: (option, Util) => {
            return 0;
        }
    }

};
