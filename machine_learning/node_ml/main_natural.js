//import brain from 'brain.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import natural from 'natural';
import * as tf from '@tensorflow/tfjs'
import { setBackend,
         trainTestSplit,
         accuracyScore,
         precisionScore,
         recallScore,
         rocAucScore
} from 'scikitjs'
setBackend(tf)

const filename = "naiveBayesNatural.js";

/*
// Create a Neural Network
const model = new brain.NeuralNetwork();

// Train the Network with 4 input objects
model.train([
    {input:[0,0], output:{zero:1}},
    {input:[0,1], output:{one:1}},
    {input:[1,0], output:{one:1}},
    {input:[1,1], output:{zero:1}},
]);

//https://github.com/BrainJS/brain.js/issues/97
fs.writeFileSync('ptm.js', `export default ${ model.toFunction().toString() };`);


// What is the expected output of [1,0]?
let result = nnClassify([1,0]);;

// Display the probability for "zero" and "one"
console.log(... result["one"] + " " + result["zero"]);
*/

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

console.log("Data parsed.");

/*
const model = new brain.recurrent.RNN();

model.train(data);

fs.writeFileSync('brainjs-rnn.js', `export default ${ model.toFunction().toString() };`);
*/

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
console.log(`AUC: ${rocAucScore(ytest, ytestPredict)}`);

//fs.writeFileSync(filename, JSON.stringify(model));
