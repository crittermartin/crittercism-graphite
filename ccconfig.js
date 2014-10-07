// Crittercism Connector configuration
// Please fill in the values appropriate to your installation below:
//
var config = {};

config.Crittercism = {};
config.Graphite = {};
config.Telemetry = {};

// Fill in your Crittercism details below.
// Client ID is your API access token provided by Crittercism Support.
config.Crittercism.clientID = 'YOUR_TOKEN';
config.Crittercism.username = 'YOUR_LOGIN';
config.Crittercism.password = 'YOUR_PASSWORD';

// Fill in the details for your Graphite installation:
config.Graphite.host = '127.0.0.1';
// TCP port that Carbon cache server is listening on:
config.Graphite.carbonPort = 2003;
// TCP port that the Graphite HTTP server is listening on:
config.Graphite.httpPort = 8080;

// If onlyShowApps is an array of strings, 
// only apps whose names equal those strings will be tracked
//
// Example:
// config.Crittercism.onlyShowApps = [
// 	'Point of Sale MA',
// 	'Crittercism Demo',
// 	'Distribution NA',
// 	'Warehouse Tool MC',
// 	'Storage Scan NC',
// 	'Control Center',
// 	'Shipping Tracker LL',
// 	'Ops Dashboard HC',
// 	'Storefront ML',
// 	'Design Your Day',
// 	'Inventory Tracking LC'
// ];

// What app metrics to track in Graphite
config.Graphite.trackedAppMetrics = [
	'dau',
  'mau',
  'rating',
  'crashes',
  'crashPercent',
  'appLoads',
  'affectedUsers',
  'affectedUserPercent'
];

// What grouped app metrics to track in Graphite
config.Graphite.trackedErrorPieMetrics =  [
	'crashes',
	'crashPercent',
	'appLoads'
];

// What groupings to do for grouped app metrics above
config.Graphite.trackedErrorPieGroupings = [
	'appVersion'
];

// What service metrics to track in Graphite
config.Graphite.trackedServiceMetrics = [
	'latency',
	'volume',
	'errors',
	'dataIn',
	'dataOut'
];

module.exports = config;
