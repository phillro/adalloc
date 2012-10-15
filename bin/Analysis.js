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
    var closest = this.getClosest(output.best, testInput);
    return closest;
}

Analyzer.prototype.getClosest = function (bestValue, input) {
    var idx = -1;
    var minDiff = 100;
    var j = 0;
    for (var a in input) {
        var ad = input[a];
        var diff = Math.abs(ad - bestValue);
        if (diff<minDiff) {
            idx = j;
            minDiff = diff;
        }
        j++;
    }
    return {idx:idx, bestWeightedValue:bestValue, best:input[idx]};

}

exports.Analyzer = Analyzer