var fs = require('fs'),
    Analyzer = require('./Analysis').Analyzer,
    csv = require('csv');

var file = fs.readFileSync(__dirname + '/../data/data.csv', 'utf8')
var rows = file.split('\n');//.slice(1,5);

rows = rows.slice(1, rows.length);
var budget = 10000;

//Each hour the training set is recalculated, this is the number of iterations.
var iterations=10;

var trainingSet = [];
var analyzer = new Analyzer();
var hourlyAllocations = [];

//Loop through each hour, train on the last hour and calculate allocations. Allocations are now iterative
//Assuming its optimizing based on past hours(training sets) experience
// (N*N)*iterations. Slow.
for (var j = 0; j < rows.length; j++) {
    var outputRow=[];
    var inputRow = getInputRow(rows[j].split(',').slice(1, 101), budget);
    if (trainingSet.length > 0) {
        analyzer.train(trainingSet, {log:true, logPeriod:100, iterations:10});
        var allocationWeights = analyzer.test(inputRow.input);
        var allocation = analyzer.caclulateAllocation(allocationWeights, budget);
        for(var ad in allocation){
            outputRow.push(allocation[ad].toFixed(2));
        }
    }else{
        for (var i = 0; i < rows[j].split(',').length-1; i++) {
            outputRow.push('ad'+i);
        }
    }
    hourlyAllocations.push(outputRow);
    trainingSet.push(inputRow);
}

//output the hourly allocations
csv().from(hourlyAllocations).to(__dirname+'/../data/hourlyAllocations.csv');


/**
 * Builds an input row based on the budget.
 * @param row
 * @param budget
 */
function getInputRow(row, budget) {
    var clicksSum = 0;
    var bestClicks = -1;

    for (var j = 0; j < row.length; j++) {
        var clicks = parseInt(row[j]);
        clicksSum += clicks;
        if (clicks > bestClicks) {
            bestClicks = clicks;
        }
    }

    //Input object
    var input = {};
    //Contains the best ad indexes that will get the most budget allocated
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

    //Add the allocated % of the budget to the output. The max value gets %100 of the budget, if multiple max vals, split it.
    for (var j = 0; j < row.length; j++) {
        output['a' + j] = alloc.indexOf(j) > -1 ? ((1 / alloc.length) * budget) / budget : 0;
    }

    return {input:input, output:output};
}