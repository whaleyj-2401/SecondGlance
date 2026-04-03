import fs from 'fs';
import { parse } from 'csv-parse/sync';
import natural from 'natural';
import * as tf from '@tensorflow/tfjs'
import { setBackend,
         trainTestSplit,
         accuracyScore,
         precisionScore,
         recallScore
} from 'scikitjs'
setBackend(tf)

const filename = "naiveBayesNatural.json";

console.log("Parsing data...");

let data = parse(
    fs.readFileSync('generated_text.csv'),
    {
        columns : true,
        skip_empty_lines : true
    }
)

let X = [];
let y = [];

for (let i = 0; i < data.length; i++)
{
    X.push(data[i]["input"]);
    y.push(data[i]["output"]);
}

let splitData = trainTestSplit(X, y, 0.33, 0.66, 0);

let Xtrain = splitData[0];
let Xtest = splitData[1];
let ytrain = splitData[2];
let ytest = splitData[3];

console.log("Data parsed.");teFileSync('brainjs-rnn.js', `export default ${ model.toFunction().toString() };`);

let model = new natural.BayesClassifier();

console.log("Model instantiated.");

console.log("Loading data into model...");

for (let i = 0; i < Xtrain.length; i++)
    model.addDocument(Xtrain[i], ytrain[i]);

console.log("Data loaded! Now training...");

model.train();

console.log("Training successful!");

let ytestPredict = [];

for (let i = 0; i < Xtest.length; i++)
    ytestPredict.push(model.classify(Xtest[i]));

for (let i = 0; i < ytest.length; i++)
{
    ytest[i] = parseInt(ytest[i]);
    ytestPredict[i] = parseInt(ytestPredict[i]);
}

console.log("==TEST SCORES==");
console.log(`ACC: ${accuracyScore(ytest, ytestPredict)}`);
console.log(`PRC: ${precisionScore(ytest, ytestPredict)}`);
console.log(`REC: ${recallScore(ytest, ytestPredict)}`);

let fileContents = JSON.stringify(model);

fs.writeFileSync(filename, fileContents);
