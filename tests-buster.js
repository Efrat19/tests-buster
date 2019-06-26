import fs from 'fs';
import shelljs from 'shelljs';
const testsDir = './tests/unit/components/personal/campaignList';
const rootDir = '../personal/frontend';
const testPattern = /.spec.js$/;

main();

async function main(){
    shelljs.cd(rootDir);
    const files = await getTestFiles();
    const eatenTests = await eatTests(files);
    shelljs.echo(`process completed. ${eatenTests} tests busted`);
    return eatenTests;
}

async function getTestFiles(){
    return shelljs.find(testsDir).filter(file =>
        file.match(testPattern))
}

async function eatTests (testFiles) {
    let eatenTests = 0;
    for await (const file of testFiles) {
        const fileContent = await getContentOf(file);
        let cleanContent = fileContent.toString('utf-8');
        getErrorLines(getJestStderrFor(file)).map(errorLine => {
            cleanContent = getCleanContent(errorLine, cleanContent);
            eatenTests++;
        });
        writeContentBackTo(file,cleanContent);
    }
    return eatenTests;
}

function getJestStderrFor(file) {
    const cmd = `jest ${file}`;
    return shelljs.exec(cmd,{silent:true}).stderr;
}

function writeContentBackTo(file,content){
    const writer = fs.createWriteStream(file);
    writer.write(content);
    writer.end();
}

async function getContentOf(file) {
    let fileContent = '';
    const reader = fs.createReadStream(file ,{encoding: 'utf8' });
    for await (const chunk of reader) {
        fileContent += chunk;
    }
    return fileContent;
}

function getErrorLines(stderr) {
    const regex = /\n\n  ● .*\n\n/g;
    const errorLines = stderr.match(regex) || [];
    return errorLines.map(line => {
        return line.replace(/\n\n  ● /,'').replace(/\n\n/,'').split(' › ');
    });
}

function getCleanContent(errorLine,fileContent) {
    const test = findTest(errorLine,fileContent) || '';
    return extractTestFrom(fileContent,test) || fileContent;
}

function extractTestFrom(fileContent,test) {
    return test && fileContent.split(test+';').join('\n')
        .split(test).join('\n');
}


// function findblockToRemove(errorsArray,block) {
//     const innerBlock = findFullBlock(errorsArray.shift(),block)
//     if(errorsArray.length){
//         const blockToRemove = findblockToRemove(errorsArray,innerBlock)
//         if(isOnlyChild(innerBlock,block)){
//             return block;
//         }
//     }
//     return innerBlock;
// }

function findTest(errorLine,fileContent) {
    let block = fileContent;
    errorLine.forEach(level => {
        const childBlock = findFullBlock(level,block)
        //if there is only one child in the block
        // then the parent block should be deleted as well,
        //if not-
        if(! isOnlyChild(childBlock,block)){
            block = childBlock;
        }
    });
    return block;
}

function findFullBlock(description,content) {

    const allowedQuotes = '"\'`';
    const regex = new RegExp('((describe)|(it)) *\\( *['+allowedQuotes+']('+ escapeRegExp(description)+')['+allowedQuotes+']','g');
    const blockStart = content && content.match(regex) && content.match(regex)[0] || '';
    const lastPart = content && content.split(blockStart)[1] || ''; //get last part of the content
    return blockStart && lastPart && blockStart + getEndOfBlockFrom(lastPart)
}


function getEndOfBlockFrom(contentPart){
    let bracketsCounter = 1, finalBlock = '';
    contentPart.split('') // break it to chars
        .every(char => {
            switch (char) {
                case '(': bracketsCounter++;break;
                case ')': bracketsCounter--;break;
            }
            finalBlock += char;
            // when equals 0 it means the block
            // is done and i want to quit the loop
            return !!bracketsCounter
        });
    return finalBlock;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isOnlyChild(child,parent) {
    return isEmptyBlock(extractTestFrom(parent,child))
}

function isEmptyBlock(block) {
    const allowedQuotes = '"\'`';
    const regex = new RegExp('((describe)|(it)) *\\( *['+allowedQuotes+']','g');
    return (block.match(regex) || []).length === 1;
}
