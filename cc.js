// Crittercism Connector node app
// Created by Martin Stone <martin@crittercism.com>
//
// Pulls data for all apps visible to your Crittercism ID and populates it
// in your Graphite installation under app.*, via Carbon.
//
// Configuration is in ccconfig.js; please fill in your information and read
// the README file for Graphite storage_schemas.conf info.
//
var fs = require('fs'),
    path = require('path'),
    net = require('net'),
    http = require('http'),
    colors = require('colors'),
    schedule = require('node-schedule'),
    async = require('async'),
    CrittercismClient = require('./CrittercismClient.js'),
    config = require('./ccconfig.js');

var cc = new CrittercismClient(config.Crittercism.clientID);

function log(message) {
	console.log('[' + (new Date).toLocaleString() + '] ' + message);
}

function init(callback) {
	cc.init(config.Crittercism.username, config.Crittercism.password, function(err) {
		if (err) {
			log('failed to initialize: ' + err.statusCode + ': ' + err.error_description);
			callback(err);
		} else {
			log('Crittercism API client initialized');
			callback(null);		
		}
	});
}

function listApps(callback) {
	log('Updating the list of apps...');
	cc.apps(function(err, data) {
		if (err) {
			log('failed to retrieve apps: ' + JSON.stringify(err, null, '  '));
			callback(err);
		} else {
			log('Found ' + Object.keys(data).length + ' apps');
			for ( app in data ) {
				delete data[app].links;
			}
			if ( config.Crittercism.onlyShowApps ) {
				for ( app in data ) {
					if ( config.Crittercism.onlyShowApps.indexOf(data[app].appName) < 0 ) {
						delete data[app];
					}
				}
				log('Filtered apps list to ' + Object.keys(data).length + ' apps');
			}
			global.apps = data;
			callback(null);
		}
	});
}

function getAppMetrics(duration, callback) {
	log('Getting ' + config.Graphite.trackedAppMetrics.length + ' app metrics for ' + Object.keys(global.apps).length + ' apps...');

	var errorGraph = {};
	async.each(Object.keys(global.apps), function(app, callback) {
		errorGraph[app] = {};
		async.each(config.Graphite.trackedAppMetrics, function(metric, callback) {
			cc.errorGraph([app], metric, duration, null, function(err, data) {
				if (err) {
					log('Failed to get metric ' + metric + ' for app ' + app + ': ' + err.statusCode + ': ' + err.message + ' (ignored)');
				} else {
					errorGraph[app][metric] = data;
				}
				callback(null);
			});
		},
		function(err) {
			if (err) {
				log('Failed to get metrics for app ' + app + ': ' + err.statusCode + ': ' + err.message + ' (ignored)');
			}
			callback(null);
		});
	},
	function(err) {
		if (err) {
			log('Didn\'t get all the app metrics: ' + err.message + ' (ignored)');
		}
		var buffer = '';
		for ( app in errorGraph ) {
			var appNameStr = apps[app].appName.split(' ').join('_').split('.').join('-');
			for ( metric in errorGraph[app] ) {
				var d = new Date(errorGraph[app][metric].data.start);
				var ts = d.getTime() / 1000;
				var interval = errorGraph[app][metric].data.interval;
				var metricStr = errorGraph[app][metric].params.graph;
				var series = errorGraph[app][metric].data.series[0].points;
				for ( i = 0; i < series.length; i++ ) {
					var tsd = new Date(ts*1000);
					buffer += 'app.' + appNameStr + '.' + metricStr + ' ' + series[i] + ' ' + ts + '\n';
					ts += interval;
				}
			}
		}
		log('Sending ' + buffer.split('\n').length + ' app metrics to Graphite...');
		sendBuffer(buffer);
		callback(null);
	});
}

function getServiceMetrics(duration, callback) {
	log('Getting ' + config.Graphite.trackedServiceMetrics.length + ' service metrics for ' + Object.keys(global.apps).length + ' apps...');

	var perfPie = {};
	async.each(Object.keys(global.apps), function(app, callback) {
		perfPie[app] = {};
		async.each(config.Graphite.trackedServiceMetrics, function(metric, callback) {
			cc.performancePie([app], metric, duration, null, 'service', function(err, data) {
				if (err) {
					log('Failed to get metric ' + metric + ' for app ' + app + ': ' + err.statusCode + ': ' + err.message + ' (ignored)');
				} else {
					perfPie[app][metric] = data;
				}
				callback(null);
			});
		},
		function(err) {
			if (err) {
				log('Failed to get service metrics for app ' + app + ': ' + err.statusCode + ': ' + err.message + ' (ignored)');
			}
			callback(null);
		});
	},
	function(err) {
		if (err) {
			log('Didn\'t get all the service metrics: ' + err.message + ' (ignored)');
		}
		var buffer = '';
		for ( app in perfPie ) {
			var appNameStr = apps[app].appName.split(' ').join('_').split('.').join('-');
			for ( metric in perfPie[app] ) {
				var d = new Date(perfPie[app][metric].data.end);
				var ts = d.getTime() / 1000;
				var metricStr = perfPie[app][metric].params.graph;
				for ( slice in perfPie[app][metric].data.slices ) {
					var svcName = perfPie[app][metric].data.slices[slice].name;
					var svcValue = perfPie[app][metric].data.slices[slice].value;
					var svcNameNice = svcName.split('.').join('-')
					buffer += 'app.' + appNameStr + '.services.' + svcNameNice + '.' + metricStr + ' ' + svcValue + ' ' + ts + '\n';
				}
			}
		}
		log('Sending ' + buffer.split('\n').length + ' service metrics to Graphite...');
		sendBuffer(buffer);
		callback(null);
	});
}

function getGroupedAppMetrics(duration, callback) {
	log('Getting ' + config.Graphite.trackedErrorPieGroupings.length + ' groupings for ' + config.Graphite.trackedErrorPieMetrics.length + ' service metrics for ' + Object.keys(global.apps).length + ' apps...');

	var errorPie = {};
	async.each(Object.keys(global.apps), function(app, callback) {
		errorPie[app] = {};
		async.each(config.Graphite.trackedErrorPieMetrics, function(metric, callback) {
			errorPie[app][metric] = {}
			async.each(config.Graphite.trackedErrorPieGroupings, function(groupBy, callback) {
				cc.errorPie([app], metric, duration, null, groupBy, function(err, data) {
					if (err) {
						log('Failed to get metric ' + metric + ' for app ' + app + ': ' + err.statusCode + ': ' + err.message + ' (ignored)');
					} else {
						errorPie[app][metric][groupBy] = data;
					}
					callback(null);
				});
			},
			function(err) {
				if (err) {
					log('Failed to get ' + metric + ' grouped by ' + groupBy + ' for app ' + app + ' (ignored)');
				}
				callback(null);
			});
		},
		function(err) {
			if (err) {
				log('Failed to get grouped metrics for app ' + app + ': ' + err.statusCode + ': ' + err.message + ' (ignored)');
			}
			callback(null);
		});
	},
	function(err) {
		if (err) {
			log('Didn\'t get all the grouped metrics: ' + err.message + ' (ignored)');
		}
		var buffer = '';
		for ( app in errorPie ) {
			var appNameStr = apps[app].appName.split(' ').join('_').split('.').join('-');
			for ( metric in errorPie[app] ) {
				for ( groupBy in errorPie[app][metric] ) {
					var d = new Date(errorPie[app][metric][groupBy].data.end);
					var ts = d.getTime() / 1000;
					var metricStr = errorPie[app][metric][groupBy].params.graph;
					var groupByStr = errorPie[app][metric][groupBy].params.groupBy;
					for ( slice in errorPie[app][metric][groupBy].data.slices ) {
						var sliceName = errorPie[app][metric][groupBy].data.slices[slice].name;
						var sliceValue = errorPie[app][metric][groupBy].data.slices[slice].value;
						var sliceNameNice = sliceName.split('.').join('-')
						buffer += 'app.' + appNameStr + '.' + metricStr + '-groupedBy.' + groupByStr + '.' + sliceNameNice + ' ' + sliceValue + ' ' + ts + '\n';
					}
				}
			}
		}

		log('Sending ' + buffer.split('\n').length + ' grouped app metrics to Graphite...');
		sendBuffer(buffer);
		callback(null);
	});
}

function getLiveAppMetrics(callback) {
	var periodic = {};
	log('Getting live periodic data for ' + Object.keys(global.apps).length + ' apps from Crittercism...');
	async.each(Object.keys(global.apps), function(app, callback) {
		cc.liveStatsPeriodic(app, null, true, function(err, data) {
			if (err) {
				log('Failed to get periodic data for app id ' + app);
			} else {
				periodic[app] = data;
			}
			callback(null);
		});
	},
	function(err) {
		if (err) {
			log('Didn\'t get all the live metrics: ' + err.message + ' (ignored)');
		}
		var buffer = '';
		for ( app in periodic ) {
			var appNameStr = global.apps[app].appName.split(' ').join('_').split('.').join('-');
			var prefix = 'app.' + appNameStr + '.live.';

			periodic[app].periodic_data.forEach(function(point) {
				buffer += prefix + 'appLoads ' + point.app_loads + ' ' + point.time / 1000 + '\n';
				buffer += prefix + 'crashes ' + point.app_errors + ' ' + point.time / 1000 + '\n';
				buffer += prefix + 'exceptions ' + point.app_exceptions + ' ' + point.time / 1000 + '\n';
			});
		}
		log('Sending ' + buffer.split('\n').length + ' live app metrics to Graphite...');
		sendBuffer(buffer);
		callback(null);
	});
}


function sendBuffer(buffer) {
	var host = config.Graphite.host;
	var port = config.Graphite.carbonPort;

	var client = net.connect(port, host, function() {
		client.write(buffer, 'utf8', function() {
			log('Sent ' + buffer.split('\n').length + ' data points to Graphite.');
			client.end();
		});	
	});
	client.on('error', function(e) {
		log(e.code.red + ': Could not connect to Graphite at ' + host + ':' + port + ' - data dropped.');
	});
}

async.series([
	function doInit(callback) {
		init(callback);
	},
	function doListApps(callback) {
		listApps(callback);
	},

	function doPreload(callback) {
		async.parallel([
			function doPreloadAppMetrics(callback) {
				getAppMetrics(43200, callback);
			},
			function doPreloadServiceMetrics(callback) {
				getServiceMetrics(15, callback);
			},
			function doPreloadGroupedAppMetrics(callback) {
				getGroupedAppMetrics(1440, callback);
			}
		],
		function(err) {
			if (err) {
				log('Failed to preload data: ' + err.message);
				callback(err);
			} else {
				callback(null);
			}
		});
		callback(null);
	},

	function doScheduleJobs(callback) {

		var serviceMetricsRule = new schedule.RecurrenceRule();
		serviceMetricsRule.minute = [00, 15, 30, 45];
		var serviceMetricsJob = schedule.scheduleJob(serviceMetricsRule, function() {
			getServiceMetrics(15, function(err) {
				if (err) {
					log('Error getting service metrics: ' + err.message);
				}
			});
		});

		var appMetricsRule = new schedule.RecurrenceRule();
		appMetricsRule.minute = 5;
		var appMetricsJob = schedule.scheduleJob(appMetricsRule, function() {
			getAppMetrics(1440, function(err) {
				if (err) {
					log('Error getting app metrics: ' + err.message);
				}
			});
		});

		var groupedAppMetricsRule = new schedule.RecurrenceRule();
		groupedAppMetricsRule.minute = 10;
		var groupedAppMetricsJob = schedule.scheduleJob(groupedAppMetricsRule, function() {
			getGroupedAppMetrics(1440, function(err) {
				if (err) {
					log('Error getting grouped app metrics: ' + err.message);
				}
			});
		});

		var liveAppMetricsRule = new schedule.RecurrenceRule();
		liveAppMetricsRule.second = [0, 30];
		var liveAppMetricsJob = schedule.scheduleJob(liveAppMetricsRule, function() {
			getLiveAppMetrics(function(err) {
				if (err) {
					log('Error getting live app metrics: ' + err.message);
				}
			});
		});

		var updateAppListRule = new schedule.RecurrenceRule();
		updateAppListRule.minute = [1, 11, 21, 31, 41, 51];
		var updateAppListJob = schedule.scheduleJob(updateAppListRule, function() {
			listApps(function(err) {
				if (err) {
					log('Error refreshing apps list: ' + err.message);
				}
			});
		});

		var refreshTokenRule = new schedule.RecurrenceRule();
		refreshTokenRule.dayOfWeek = 0;
		var refreshTokenJob = schedule.scheduleJob(refreshTokenRule, function() {
			init(function(err) {
				if (err) {
					log('Error refreshing Crittercism token: ' + err.message);
				}
			});
		});
		/// Never call back from here == run forever
	}
]);
