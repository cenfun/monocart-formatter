const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');
const CG = require('console-grid');
const {
    format, Mapping, LineParser
} = require('monocart-formatter/node');

console.log(format, Mapping);

const inputJs = `console.log(1);var   a= true;if(a){console.log(a)}
        
var b = 2;  
    
const foo = ()   => {

};

const bar = ()=> {

};
                `;


const inputCss = `.red {
    color: red;
}

.unused,.and-used {
    position: relative;
}

/* comments */
.inline-unused{font-size:medium;}.inline-used {position:relative;}.next-unused{color:none}
            `;

const inputHtml = `
        <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>title</title>
                    <style>
                        table { width: 100%;}
                        table td { text-align: center; }
                    </style>
                </head>
                <body>
                    <div><div>
                    <span>
                </body>
            </html>
        `;

const inputJson = `{"a":"1",
"build-worker": "sf b worker -p","build-formatter": "sf b formatter -p",
 "build": "sf lint && npm run build-worker && npm run build-formatter",
"patch": "npm run build && sf publish patch"
}
`;

const main = async () => {

    const list = [{
        type: 'js', source: inputJs
    }, {
        type: 'css', source: inputCss
    }, {
        type: 'html', source: inputHtml
    }, {
        type: 'json', source: inputJson
    }];

    for (const item of list) {

        console.log('===========================================');
        const { content, mapping } = await format(item.source, item.type);
        console.log(EC.cyan(content));
        console.log(mapping);

    }

    const files = [
        path.resolve(__dirname, 'example.css'),
        path.resolve(__dirname, 'example.js')
    ];


    files.forEach((p) => {
        const content = fs.readFileSync(p).toString('utf-8');
        const lineParser = new LineParser(content);

        CG({
            columns: [{
                id: 'indent',
                formatter: (v) => {
                    if (!v) {
                        return '';
                    }
                    return v;
                }
            }, {
                id: 'text'
            }, {
                id: 'blank',
                formatter: (v) => {
                    if (!v) {
                        return '';
                    }
                    return v;
                }
            }, {
                id: 'length'
            }],
            rows: lineParser.lines
        });

    });

};

main();
