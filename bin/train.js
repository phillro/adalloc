var fs = require('fs'),
    async = require('async'),
    Analyzer = require('./Analysis').Analyzer;

var i = 0;
var rows = [];

var file = fs.readFileSync(__dirname + '/../data/data.csv', 'utf8')
var rows = file.split('\n').slice(1, 500);
var budget = 10000;
var trainingSet = [];
for (var j = 0; j < rows.length; j++) {
    trainingSet.push(getInputRow(rows[j].split(',').slice(1, 101),budget));
}

var analyzer = new Analyzer();
analyzer.train(trainingSet, {log:true, logPeriod:100, iterations:10});

//We will use the last row as the input.
var lastRow = rows.slice(500,501);

//Test gives us the weightings
var allocationWeights = analyzer.test(getInputRow(lastRow).input,budget);
var allocations = analyzer.caclulateAllocation(allocationWeights,budget);
console.log(allocations);

function getInputRow(row,budget) {
    var clicksSum = 0;
    var bestClicks = -1;

    for (var j = 0; j < row.length; j++) {
        var clicks = parseInt(row[j]);
        clicksSum += clicks;
        if (clicks > bestClicks) {
            bestClicks = clicks;
        }
    }

    var input = {};
    var alloc = [];
    var output = {};
    var bestWeighted = -1;

    for (var j = 0; j < row.length; j++) {
        var clicks = row[j];
        var weightedValue = clicks / clicksSum;
        input['a' + j] = weightedValue;
        if (weightedValue > bestWeighted) {
            bestWeighted = weightedValue;
        }
        if (clicks == bestClicks) {
            alloc.push(j);
        }
    }

    var allocated=0;
    for (var j = 0; j < row.length; j++) {
        var a =0;
        if (alloc.indexOf(j) > -1) {
            a = ((1 / alloc.length)*budget)/budget;
        } else {
            a=0;
        }
        output['a' + j] =a
        allocated+=a;
    }

    return {input:input, output:output};
}