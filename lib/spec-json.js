/**
 * Module dependencies.
 */
var Base = require('mocha').reporters.Base;


/**
 * Expose `SpecJson`.
 */

exports = module.exports = SpecJson;

/**
 * Initialize a new `SpecJson` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function SpecJson(runner) {
    Base.call(this, runner);

    var root = null
      , self = this;
    
    function mapTest(test) {
        var newTest = {
            title: test.title,
            duration: test.duration,
            state: test.state,
            file: test.file
        };

        if (newTest.state == "failed") {
            newTest.err = test.err;
        }

        return newTest;
    }

    function mapSuite(suite) {
        return {
            title: suite.title,
            pending: suite.pending,
            suites: suite.suites,
            tests: suite.tests
        };
    }

    function formatSuite(suite) {
        var newSuite = mapSuite(suite);

        newSuite.tests = newSuite.tests.map(function (test) {
            return mapTest(test);
        });

        newSuite.suites = newSuite.suites.map(function (_suite) {
            return formatSuite(_suite);
        });

        return newSuite;
    };

    runner.on('suite', function (suite) {
        if (suite.root) {
            root = suite;
        }
    });

    runner.on('end', function () {
        var output = formatSuite(root);
        output.stats = self.stats
        console.log('test');
        console.log(JSON.stringify(output, null, 2));
        //process.stdout.write(JSON.stringify(output, null, 2));
    });
}

/**
 * Inherit from `Base.prototype`.
 */

SpecJson.prototype.__proto__ = Base.prototype;
