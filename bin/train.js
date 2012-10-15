var fs = require('fs'),
    async = require('async'),
    Analyzer = require('./Analysis').Analyzer;

var i = 0;
var rows = [];

var file = fs.readFileSync(__dirname + '/../data/data.csv', 'utf8')
var rows = file.split('\n').slice(1, 20);

/*
 var trainingSet = [
 {input:{ a1:0.03, a2:0.7, a3:0.5 }, output:{ best:0.7 }},
 {input:{ a1:0.16, a2:0.09, a3:0.2 }, output:{ best:.2 }},
 {input:{ a1:0.5, a2:0.5, a3:1.0 }, output:{ best:1.0 }}
 ];*/

var trainingSet = [];
for (var j = 0; j < rows.length; j++) {
    trainingSet.push(getInputRow(rows[j].split(',').slice(1,101)));
}

var analyzer = new Analyzer();
analyzer.train(trainingSet, {log:true, logPeriod:10, iterations:10});

var testRow = [28,12,14,6,8,6,18,4,111,36,1,14,6,5,1,32,101,8,9,12,7,23,8,33,8,14,0,111,4,8,8,34,7,0,7,9,21,20,15,3,10,18,12,30,22,16,4,3,10,19,10,30,11,0,22,8,0,13,44,4,21,9,6,0,30,9,16,40,7,30,6,3,1,5,31,4,22,15,35,18,15,120,9,0,0,10,34,36,11,17,16,4,1,18,36,10,20,18,20,10];

var output = analyzer.test(getInputRow(testRow).input);
console.log(output);

function getInputRow(row) {
    var trainingSetInput = [];
    var clicksSum = 0;
    for (var j = 0; j < row.length; j++) {
        var clicks = parseInt(row[j]);
        clicksSum+=clicks;
    }

    var input = {};
    var bestWeighted = -1;
    var bestWeightedIdx = -1;
    for (var j = 0; j < row.length; j++) {
        var clicks = row[j];
        var weightedValue = clicks/clicksSum;
        input[j]=weightedValue;
        if(weightedValue>bestWeighted){
            bestWeighted=weightedValue;
            bestWeightedIdx=j;
        }
    }
    return {input:input, output:{best:bestWeighted}};
}