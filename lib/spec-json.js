/**
 * Module dependencies.
 */
var Base = require('mocha').reporters.Base
    , fs = require('fs');


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
      , filename = 'mocha-spec.json'
      , self = this;
    
    function mapTest(test) {
        var newTest = {
            title: test.title,
            fullTitle: test.fullTitle(),
            duration: test.duration,
            timeout: test.timeOut,
            sync: test.sync,
            async: test.async,
            type: test.type,
            speed: test.speed,
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
            root: suite.root,
            timeout: suite._timeout,
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

    runner.on('start', function () {

    });

    runner.on('suite', function (suite) {
        if (suite.root) {
            root = suite;
        }
    });

    runner.on('end', function () {
        var output = formatSuite(root);
        output.stats = self.stats

        fs.writeFileSync(filename, JSON.stringify(output, null, 4));
        console.log("File written to " + filename);
    });
}

/**
 * Inherit from `Base.prototype`.
 */

SpecJson.prototype.__proto__ = Base.prototype;
