import fs from 'fs';
import readline from 'readline';
import Network from "./Network";

function getBinary(word: string) {
    return Array.from(word)
            .map(
                (c, i) =>
                    word
                        .charCodeAt(i)
                        .toString(2)
            )
            .join('')
}

async function processLineByLine(file: string) {
    const result = []
    const fileStream = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    for await (const line of rl) {
        result.push(line)
    }

    return result;
}

Promise
    .all([processLineByLine('0.txt'), processLineByLine('1.txt')])
    .then((words: [string[], string[]]) => {
        const network = new Network();
        let codesNegative = words[0].map(getBinary);
        let codesPositive = words[1].map(getBinary);

        network.addDataLayer([], 10);
        network.addHiddenLayer(128);
        network.addDataLayer([1, 2]);
        
        // ? Power of a signal will be depends on a distance to an output node
        
        // Train
        codesNegative.forEach((code, i) => {
            network.fillInput(code.split('').map(c => +c));
            network.train(1);
        })

        codesPositive.forEach((code, i) => {
            network.fillInput(code.split('').map(c => +c));
            network.train(2);
        })
        
        network.fillInput(getBinary('abound').split('').map(c => +c));
        network.predict();
        
        console.log(network.layers[network.layers.length - 1].nodes.map(node => node.hits));
    })