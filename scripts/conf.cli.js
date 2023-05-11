// starfall-cli config
// https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');

module.exports = {

    build: {

        vendors: ['formatter', 'code-viewer'],

        beforeAll: (jobList, Util) => {
            console.log('add dcheck.js before build all');

            const dccheckPath = path.resolve('node_modules/chrome-devtools-frontend/front_end/core/platform/dcheck.js');
            const functionImplementation = '';
            const dccheckContent = `export function DCHECK(condition, message = 'DCHECK') {${functionImplementation}}`;
            fs.writeFileSync(dccheckPath, dccheckContent);

            return 0;
        },


        before: (item, Util) => {
            console.log('before build');

            if (item.production) {
                item.devtool = false;
            }

            if (item.name === 'formatter') {
                console.log('generating formatter-worker.js ...');
                const workerPath = path.resolve(item.buildPath, '../../formatter-worker/dist/monocart-formatter-worker.js');
                if (!fs.existsSync(workerPath)) {
                    Util.logRed(`please build formatter-worker first, not found build ${workerPath}`);
                    return 0;
                }
                const buf = fs.readFileSync(workerPath);
                const { deflateSync } = require('lz-utils');
                const workerData = `export default "${deflateSync(buf)}";`;
                Util.writeFileSync(path.resolve('.temp/formatter-worker.js'), workerData);
            }

            return 0;
        },

        after: (item, Util) => {
            // console.log('after build');
            return 0;
        }


        // afterAll: (option, Util) => {
        //     console.log('after build all');
        //     return 0;
        // }
    }

};
