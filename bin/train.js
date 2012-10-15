var fs = require('fs'),
    Analyzer = require('./Analysis').Analyzer;


var file = fs.readFileSync(__dirname + '/../data/data.csv', 'utf8')
var rows = file.split('\n');
var lastRow = rows.slice(rows.length,rows.length+1);
rows = rows.slice(1, rows.length);
var budget = 10000;

//Build the training set
var trainingSet = [];
for (var j = 0; j < rows.length; j++) {
    trainingSet.push(getInputRow(rows[j].split(',').slice(1, 101),budget));
}

//Test it based on rows.length-1 entries
var analyzer = new Analyzer();
analyzer.train(trainingSet, {log:true, logPeriod:100, iterations:10});


//Test gives us the weightings for the lastRow based on the training set
var allocationWeights = analyzer.test(getInputRow(lastRow).input,budget);
var allocations = analyzer.caclulateAllocation(allocationWeights,budget);

//Output the allocated amounts
console.log(allocations);

var allocated=0;
for (var a in allocations){
    allocated+=allocations[a];
}
console.log('Allocated: '+allocated);

/**
 * Builds an input row based on the budget.
 * @param row
 * @param budget
 */
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

    //Input object
    var input = {};
    //Contains the best ads indexes that will get the most budget allocated
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
        output['a'+j]=alloc.indexOf(j)>-1 ? ((1 / alloc.length)*budget)/budget : 0;
    }

    return {input:input, output:output};
}