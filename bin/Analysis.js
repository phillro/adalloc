/**
 * User: philliprosen
 * Date: 10/15/12
 * Time: 2:37 PM
 */

var brain = require('brain');

function Analyzer() {
    this.net = new brain.NeuralNetwork();

}

Analyzer.prototype.train = function (trainingSet, options) {
    var options = options || {};
    this.net.train(trainingSet, options)
}

Analyzer.prototype.test = function (testInput) {
    var output = this.net.run(testInput);
    return output;
}

Analyzer.prototype.getClosest = function (bestValue, input) {
    var idx = -1;
    var minDiff = 100;
    var j = 0;
    for (var a in input) {
        var ad = input[a];
        var diff = Math.abs(ad - bestValue);
        if (diff < minDiff) {
            idx = j;
            minDiff = diff;
        }
        j++;
    }
    return {idx:idx, bestWeightedValue:bestValue, best:input[idx]};
}

Analyzer.prototype.caclulateAllocation = function (allocationWeights, budget) {
    var allocation = {};
    var allocated = 0;
    var totalAlloc = 0;
    for (var a in allocationWeights) {
        totalAlloc += allocationWeights[a]
    }
    for (var a in allocationWeights) {
        allocation[a] = (allocationWeights[a] / totalAlloc) * 10000;
        allocated += allocation[a];
    }
    return allocation;
}

exports.Analyzer = Analyzer