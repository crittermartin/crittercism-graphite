/* global _ */

/*
 * Complex scripted dashboard
 * This script generates a dashboard object that Grafana can load. It also takes a number of user
 * supplied URL parameters (int ARGS variable)
 *
 * Return a dashboard object, or a function
 *
 * For async scripts, return a function, this function must take a single callback function as argument,
 * call this callback function with the dashboard object (look at scripted_async.js for an example)
 */


var appName = 'Crittercism_Demo';

// accessable variables in this scope
var window, document, ARGS, $, jQuery, moment, kbn;

// Setup some variables
var dashboard, timspan;

// All url parameters are available via the ARGS object
var ARGS;

// Set a default timespan if one isn't specified
timspan = '30d';

// Intialize a skeleton with nothing but a rows array and service object
dashboard = 
{
  "id": null,
  "title": "Grafana",
  "originalTitle": "Grafana",
  "tags": [],
  "style": "dark",
  "timezone": "browser",
  "editable": true,
  "hideControls": false,
  "rows": [
    {
      "title": "test",
      "height": "250px",
      "editable": true,
      "collapse": false,
      "panels": [
        {
          "id": 4,
          "span": 6,
          "type": "graph",
          "x-axis": true,
          "y-axis": true,
          "scale": 1,
          "y_formats": [
            "percent",
            "short"
          ],
          "grid": {
            "max": null,
            "min": null,
            "leftMax": null,
            "rightMax": null,
            "leftMin": null,
            "rightMin": null,
            "threshold1": null,
            "threshold2": null,
            "threshold1Color": "rgba(216, 200, 27, 0.27)",
            "threshold2Color": "rgba(234, 112, 112, 0.22)"
          },
          "resolution": 100,
          "lines": true,
          "fill": 1,
          "linewidth": 2,
          "points": false,
          "pointradius": 5,
          "bars": false,
          "stack": false,
          "spyable": true,
          "options": false,
          "legend": {
            "show": true,
            "values": true,
            "min": false,
            "max": true,
            "current": true,
            "total": false,
            "avg": true,
            "alignAsTable": true,
            "rightSide": false
          },
          "interactive": true,
          "legend_counts": true,
          "timezone": "browser",
          "percentage": false,
          "zerofill": true,
          "nullPointMode": "null as zero",
          "steppedLine": true,
          "tooltip": {
            "value_type": "cumulative",
            "query_as_alias": true
          },
          "targets": [
            {
              "target": "app.*.crashPercent"
            }
          ],
          "aliasColors": {},
          "aliasYAxis": {},
          "title": "Crash Percent (All Apps)",
          "datasource": "graphite",
          "renderer": "flot",
          "annotate": {
            "enable": false
          },
          "seriesOverrides": []
        },
        {
          "id": 5,
          "span": 6,
          "type": "graph",
          "x-axis": true,
          "y-axis": true,
          "scale": 1,
          "y_formats": [
            "short",
            "short"
          ],
          "grid": {
            "max": null,
            "min": null,
            "leftMax": null,
            "rightMax": null,
            "leftMin": null,
            "rightMin": null,
            "threshold1": null,
            "threshold2": null,
            "threshold1Color": "rgba(216, 200, 27, 0.27)",
            "threshold2Color": "rgba(234, 112, 112, 0.22)"
          },
          "resolution": 100,
          "lines": true,
          "fill": 1,
          "linewidth": 2,
          "points": false,
          "pointradius": 5,
          "bars": true,
          "stack": true,
          "spyable": true,
          "options": false,
          "legend": {
            "show": true,
            "values": true,
            "min": false,
            "max": true,
            "current": true,
            "total": false,
            "avg": true,
            "alignAsTable": true,
            "rightSide": false
          },
          "interactive": true,
          "legend_counts": true,
          "timezone": "browser",
          "percentage": false,
          "zerofill": true,
          "nullPointMode": "null as zero",
          "steppedLine": true,
          "tooltip": {
            "value_type": "cumulative",
            "query_as_alias": true
          },
          "targets": [
            {
              "target": "app.Ops_Dashboard_HC.appLoads-groupedBy.appVersion.*",
              "hide": false
            }
          ],
          "aliasColors": {},
          "aliasYAxis": {},
          "title": "Ops Dashboard: App Loads By Version",
          "datasource": "graphite",
          "renderer": "flot",
          "annotate": {
            "enable": false
          },
          "seriesOverrides": []
        }
      ]
    },
    {
      "title": "test",
      "height": "250px",
      "editable": true,
      "collapse": false,
      "panels": [
        {
          "id": 6,
          "span": 6,
          "type": "graph",
          "x-axis": true,
          "y-axis": true,
          "scale": 1,
          "y_formats": [
            "short",
            "short"
          ],
          "grid": {
            "max": null,
            "min": null,
            "leftMax": null,
            "rightMax": null,
            "leftMin": null,
            "rightMin": null,
            "threshold1": null,
            "threshold2": null,
            "threshold1Color": "rgba(216, 200, 27, 0.27)",
            "threshold2Color": "rgba(234, 112, 112, 0.22)"
          },
          "resolution": 100,
          "lines": true,
          "fill": 1,
          "linewidth": 2,
          "points": false,
          "pointradius": 5,
          "bars": true,
          "stack": true,
          "spyable": true,
          "options": false,
          "legend": {
            "show": true,
            "values": true,
            "min": false,
            "max": true,
            "current": true,
            "total": false,
            "avg": true,
            "alignAsTable": true,
            "rightSide": false
          },
          "interactive": true,
          "legend_counts": true,
          "timezone": "browser",
          "percentage": false,
          "zerofill": true,
          "nullPointMode": "null as zero",
          "steppedLine": true,
          "tooltip": {
            "value_type": "cumulative",
            "query_as_alias": true
          },
          "targets": [
            {
              "target": "app." + appName + ".crashPercent-groupedBy.appVersion.*",
              "hide": false
            }
          ],
          "aliasColors": {},
          "aliasYAxis": {},
          "title": appName + ": Crash % By Version",
          "datasource": "graphite",
          "renderer": "flot",
          "annotate": {
            "enable": false
          },
          "seriesOverrides": []
        },
        {
          "id": 7,
          "span": 6,
          "type": "graph",
          "x-axis": true,
          "y-axis": true,
          "scale": 1,
          "y_formats": [
            "short",
            "short"
          ],
          "grid": {
            "max": null,
            "min": null,
            "leftMax": 5,
            "rightMax": null,
            "leftMin": 0,
            "rightMin": null,
            "threshold1": null,
            "threshold2": null,
            "threshold1Color": "rgba(216, 200, 27, 0.27)",
            "threshold2Color": "rgba(234, 112, 112, 0.22)"
          },
          "resolution": 100,
          "lines": false,
          "fill": 1,
          "linewidth": 2,
          "points": true,
          "pointradius": 2,
          "bars": false,
          "stack": false,
          "spyable": true,
          "options": false,
          "legend": {
            "show": true,
            "values": true,
            "min": false,
            "max": true,
            "current": true,
            "total": false,
            "avg": true,
            "alignAsTable": true,
            "rightSide": false
          },
          "interactive": true,
          "legend_counts": true,
          "timezone": "browser",
          "percentage": false,
          "zerofill": true,
          "nullPointMode": "null as zero",
          "steppedLine": true,
          "tooltip": {
            "value_type": "cumulative",
            "query_as_alias": true
          },
          "targets": [
            {
              "target": "app.*.rating"
            }
          ],
          "aliasColors": {},
          "aliasYAxis": {},
          "title": "App Rating: All Apps",
          "datasource": "graphite",
          "renderer": "flot",
          "annotate": {
            "enable": false
          },
          "seriesOverrides": [],
          "leftYAxisLabel": "Stars"
        }
      ]
    }
  ],
  "nav": [
    {
      "type": "timepicker",
      "collapse": false,
      "enable": true,
      "status": "Stable",
      "time_options": [
        "5m",
        "15m",
        "1h",
        "6h",
        "12h",
        "24h",
        "2d",
        "7d",
        "30d"
      ],
      "refresh_intervals": [
        "5s",
        "10s",
        "30s",
        "1m",
        "5m",
        "15m",
        "30m",
        "1h",
        "2h",
        "1d"
      ],
      "now": true,
      "notice": false
    }
  ],
  "time": {
    "from": "now-30d",
    "to": "now"
  },
  "templating": {
    "list": []
  },
  "annotations": {
    "list": [],
    "enable": false
  },
  "version": 6
};

return dashboard;
