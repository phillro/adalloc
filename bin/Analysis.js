/**
 * User: philliprosen
 * Date: 10/15/12
 * Time: 2:37 PM
 */

var brain = require('brain');

function Analyzer() {
    this.net = new brain.NeuralNetwork();

}

/**
 * Trains
 * @param trainingSet
 * @param options (brain.js train options)
 */
Analyzer.prototype.train = function (trainingSet, options) {
    var options = options || {};
    this.net.train(trainingSet, options)
}

/**
 * Tests an input based on the existing training set
  * @param testInput
 */
Analyzer.prototype.test = function (testInput) {
    var output = this.net.run(testInput);
    return output;
}

/**
 * Calculates the allocation based on the weights and budget
 * @param allocationWeights
 * @param budget
 */
Analyzer.prototype.caclulateAllocation = function (allocationWeights, budget) {
    var allocation = {};
    var allocated = 0;
    var totalAlloc = 0;
    for (var a in allocationWeights) {
        totalAlloc += allocationWeights[a]
    }
    for (var a in allocationWeights) {
        allocation[a] = (allocationWeights[a] / totalAlloc) * budget;
        allocated += allocation[a];
    }
    return allocation;
}



exports.Analyzer = Analyzer