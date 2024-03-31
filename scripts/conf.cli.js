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

const buildReadme = (Util) => {
    Util.logCyan('build README.md');
    const template = fs.readFileSync(path.resolve(__dirname, './README.md')).toString('utf-8');

    const types = fs.readFileSync(path.resolve(__dirname, '../lib/index.d.ts')).toString('utf-8');

    const readme = Util.replace(template, {
        replace_holder_types: types
    });

    fs.writeFileSync(path.resolve(__dirname, '../README.md'), readme);

};

module.exports = {

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
            buildReadme(Util);
            return 0;
        }
    }

};
