var fs = require('fs'),
    Analyzer = require('./Analysis').Analyzer,
    csv = require('csv');

var file = fs.readFileSync(__dirname + '/../data/data.csv', 'utf8')
var rows = file.split('\n');//.slice(1, 10);
var outputFileName = '/../data/hourlyAllocations3.csv';

rows = rows.slice(1, rows.length);
var budget = 10000;

//Each hour the training set is recalculated, this is the number of iterations done each time .train() is called.
var iterations = 10;

var analyzer = new Analyzer();
//Can do singlePassTraining or iterativeTraining
//Single pass trains once on the entire data set, Iterative will train, then allocate once for each row
//Iterative resembles a real world scenario beter probably, but for this example is much slower
var trainingStrategy = iterativeTraining;


trainingStrategy(rows, iterations, function (hourlyAllocations) {
    //output the hourly allocations
    csv().from(hourlyAllocations).to(__dirname + outputFileName);
})

/**
 * Do one training based on all the rows. Much faster then doing it after each row.
 * @param rows
 * @param iterations
 * @param cb
 */
function singlePassTraining(rows, iterations, cb) {
    var hourlyAllocations = [];
    var trainingSet = [];
    for (var i = 0; i < rows.length; i++) {
        var inputRow = getInputRow(rows[i].split(',').slice(1, 101), budget);
        trainingSet.push(inputRow);
    }
    analyzer.train(trainingSet, {log:true, logPeriod:100, iterations:iterations});
    var outputRow = [];
    for (var i = 0; i < rows[j].split(',').length - 1; i++) {
        outputRow.push('ad' + i);
    }
    hourlyAllocations.push(outputRow);

    for (var i = 0; i < rows.length; i++) {
        var outputRow = [];
        var inputRow = getInputRow(rows[i].split(',').slice(1, 101), budget);
        var allocationWeights = analyzer.test(inputRow.input);
        var allocation = analyzer.caclulateAllocation(allocationWeights, budget);

        for (var ad in allocation) {
            outputRow.push(allocation[ad].toFixed(2));
        }
        hourlyAllocations.push(outputRow);
    }
    cb(hourlyAllocations);
}

//Loop through each hour, train on the last hour and calculate allocations. Allocations are now iterative, rebalancing after each hour.
//However, its O(n*n). Would be much better to do one pass on a single training set and test each new hour, but I wanted an hourly progression of rebalancing the budget.
//Assumes its optimizing based on past hours(training sets) experience
//Not sure this is actually better
function iterativeTraining(rows, iterations, cb) {
    var trainingSet = [];
    var hourlyAllocations = [];
    for (var j = 0; j < rows.length; j++) {
        var outputRow = [];
        var inputRow = getInputRow(rows[j].split(',').slice(1, 101), budget);
        if (trainingSet.length > 0) {
            analyzer.train(trainingSet, {log:true, logPeriod:100, iterations:iterations});
            var allocationWeights = analyzer.test(inputRow.input);
            var allocation = analyzer.caclulateAllocation(allocationWeights, budget);
            for (var ad in allocation) {
                outputRow.push(allocation[ad].toFixed(2));
            }
        } else {
            for (var i = 0; i < rows[j].split(',').length - 1; i++) {
                outputRow.push('ad' + i);
            }
        }
        hourlyAllocations.push(outputRow);
        trainingSet.push(inputRow);
    }
    cb(hourlyAllocations);
}

/**
 * Builds an input row based on the budget.
 * @param row
 * @param budget
 */
function getInputRow(row, budget) {
    var clicksSum = 0;
    var bestClicks = -1;
    //If a value is %minSimilairity to the max, we take it.
    var minSimilairity = .9;

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
        var clicks = parseInt(row[j]);
        var weightedValue = clicks / clicksSum;
        input['a' + j] = weightedValue;
        if (weightedValue > bestWeighted) {
            bestWeighted = weightedValue;
        }
        if (clicks / bestClicks >= minSimilairity) {
            alloc.push(j);
        }
    }

    //Add the allocated % of the budget to the output. The max value(s) gets %100 of the budget in the training output. If multiple max vals, split it evenly.
    for (var j = 0; j < row.length; j++) {
        output['a' + j] = alloc.indexOf(j) > -1 ? ((1 / alloc.length) * budget) / budget : 0;
    }

    return {input:input, output:output};
}