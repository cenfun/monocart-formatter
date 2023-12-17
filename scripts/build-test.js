const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');

const main = () => {

    EC.logCyan('build test cases ... ');

    const dir = path.resolve(__dirname, '../test/cases');
    const files = fs.readdirSync(dir);

    const key = '.formatted';
    const formattedList = files.filter((it) => it.indexOf(key) !== -1);

    const types = {
        complex: 'js'
    };

    const list = formattedList.map((formattedName) => {
        const name = formattedName.replace(key, '');
        const baseName = path.basename(name, '.txt');
        const type = types[baseName] || baseName;
        console.log(name, type);
        const content = fs.readFileSync(path.resolve(dir, name)).toString('utf-8');
        const formattedContent = fs.readFileSync(path.resolve(dir, formattedName)).toString('utf-8');
        return {
            type,
            name,
            content,
            formattedName,
            formattedContent
        };
    });

    //

    // save list
    // console.log(list);

    const content = JSON.stringify(list, null, 4);

    const filepath = path.resolve(dir, '../test-cases.json');
    fs.writeFileSync(filepath, content);

    console.log(list.map((it) => it.name));
    EC.logGreen(`saved ${path.relative(process.cwd(), filepath)}`);

};

main();
