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

    build: {

        vendors: ['formatter'],

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

                Util.logCyan('copy README.md');
                fs.cpSync(
                    path.resolve(__dirname, '../README.md'),
                    path.resolve(__dirname, '../packages/formatter/README.md')
                );

                Util.logCyan('copy monocart-formatter-worker-node.lz.js');
                fs.cpSync(
                    path.resolve(__dirname, '../packages/worker-node/dist/monocart-formatter-worker-node.lz.js'),
                    path.resolve(__dirname, '../packages/formatter/dist/monocart-formatter-worker-node.lz.js')
                );

            } else if (item.name === 'worker') {
                lzPackage('worker', Util);
            } else if (item.name === 'worker-node') {
                lzPackage('worker-node', Util);
            }

            return 0;
        }


        // afterAll: (option, Util) => {
        //     console.log('after build all');
        //     return 0;
        // }
    }

};
