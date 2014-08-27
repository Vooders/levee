'use strict';

var Levee = require('./lib/levee');
var Stats = require('./lib/stats');


module.exports = function (command, options) {
    var stats, levee;

    if (typeof command === 'function') {
        command = {
            execute: command
        };
    }

    stats = new Stats();

    levee = new Levee(command, options);
    levee.__defineGetter__('stats', (function (stats) {
        return stats.snapshot.bind(stats);
    })(stats));

    levee.on('execute', stats.increment.bind(stats, 'executions'));
    levee.on('reject',  stats.increment.bind(stats, 'rejections'));
    levee.on('success', stats.increment.bind(stats, 'successes'));
    levee.on('failure', stats.increment.bind(stats, 'failures'));
    levee.on('timeout', stats.increment.bind(stats, 'timeouts'));
    levee.on('duration', stats.sample.bind(stats, 'duration'));

    return levee;
};

