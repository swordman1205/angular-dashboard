# PrimeCli - Jenkins Test
https://stackoverflow.com/questions/41974070/how-to-download-build-output-files-from-jenkins-ui-console-itself
https://stackoverflow.com/questions/15827417/how-to-add-a-file-to-download-into-jenkins-hudson-plugin
Test
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



isloggedin
https://netbasal.com/angular-2-persist-your-login-status-with-behaviorsubject-45da9ec43243

// TODO:
1. Add alerts growl - https://www.primefaces.org/primeng/#/growl
2. No data widget
3. Another chart widget
4. Change back to lazy module - use translation lazy also: https://github.com/ngx-translate/core
5. Asset Chart - Chart (panel) size should be explicit
8. Asset Chart - Flags for statuses
7. Asset Chart - Move logic of time to a new component
9. Asset Chart - Erez - simplify.js
10. Move to Settings: Time of growl messages, stiky or not (dashboard-page.component.html)



1. Tags
2. Logo, CSS, Style


2. AutoRefresh
2. Settings - AutoRefresh Enable, AutoRefreshTime, Growl visible unlimited, time ?
4. Tests - Applitools
7. Sync with erez about statuses
8. When refresh on assetMeasure dashboard - I18N captions are not ok
9. Get statuses svg from Adam
10. Charts - UTC
11. Chart to grid feature
12 Asset screen -> 
13. More widgets for asset measure screen -> information, guage, (chart to grid)

Erez:
=====
1. GetStatusUpdate - Should Recive small object with +-6 properties
2. V - Asset Chart - Erez - simplify.js
3. V - Support Save user tags in server

===========================
1. Location dashboard - D3
2. Check all routes - back - refresh - for location tag dasgboard
3. OnClick - Routing
4. Check that hybrid works on navigator & breadcrumbs too
5. Lazy Loading asset tags
6. CSS

Bugs:
    73. Add status icons in navigator
    86. Alarm Dashboard - Settings page title "Login Credentials" to "Settings"
    Also relevant for "Asset Dashboard"
    85. Failed to update Refresh Interval on Alarm Dashboard - it remains always on 1 minute
    81. Logout is not working
    79. Font Awesome in the first time show text (https://github.com/angular/angular-cli/issues/1463)
    
    
Sync:
    Bugs:
    89. set Alarm Bypass alarm for an asset
    84. same same but different
    
    Features:
    Ticket screen ?
    Alarms screen ?
    Location info screen ?

===========
V - ITag -> LocationTags + AssetTags filter
V - Alarms - parse columns
V - Ticket - parse columns
V - Alarm, Ticket widgets for location tags dashboard
V - Auto refresh for 2 new widgets
V - Alarm & Ticket - links to locations, assets, asset measures
V - Tickets widget filter: open, all
V - Tickets widget filter: from-to
 
* - Refresh page
    Bugs:
    1. I18N after refresh
    2. ITag screen 
* - Alarm, Ticket widgets for asset tags dashboard ? (We have asset dashboard there already)


https://github.com/angular/angular-cli/issues/9194

HighCharts
==========
Must

* Digital - Door
    FLDev -> ECS Test -> New WiFi - NTC22 -> Door #2 -> Nov/Dec 2107
* Flags

* Handle no data in charts - yAxis not created & 4 threshold series created which cause bugs

* Grid Style
* Button for performance - Get all data or just some of the data
** need to destroy the chart, and recreate
** ngSwitch don't load the chart to the dom in time

Done:
* Gauges is working
* can't see thresholds

* turboThreshold - more then 1000 points enabled
* Axis labels format (date)
    highcharts works with unix milliseconds - moment should be milliseconds, and not seconds
* Style - margins out, buttons on top fixed, yAxis position (left, right)
* Threshold Series - Dashed
    https://www.highcharts.com/docs/chart-concepts/series#11
* From-To
* ProgressBar-Loading
* Bug - Not rendering on asset measure chart: hack: setTimeout
* yAxis duplication each time - yAxisInitialized flag
* Clear series when rerendring chart
* Dual xAxis - Day, Time
* number to fixed x.00 by user custom
* Tooltip units

====
axis explenation: https://www.highcharts.com/docs/chart-concepts/axes
style, margins: https://www.highcharts.com/docs/chart-design-and-style/design-and-style


* Digital - Door
    FLDev -> ECS Test -> New WiFi - NTC22 -> Door #2 -> Nov/Dec 2107
* Pie Chart


// TODO: 1/4
Temperature - units
yAxis - digital values

Chart Opacity
message when there is no data
Flag Status
refresh button

V - Breadcrumbs - color shilshul
V - License - https://forum.highcharts.com/post139060.html#p139060
V - Door chart type is line, all others are spline
V - No thresholds when digital value
V - Remove units from yAxis in case of digital
V - Door - True/False string Nafem - Report 6, Asset DC6B Door 5/2016
V - Remove the explicit from-to 2016
V - Set the Y axis for digital

location dashboard:
===================
1. widget padding
2. time icon to activity grid
3. icons of tabs in the breadcrumbs header
4. routing
5. navigation-menu noWrap
6. navigation menu status icons
7. fontAwesome upgrade
8. tree navigation - menu
9.configuration style

tags
====
1. Tags dashboard implement
2. Configuration toggle button disable
3. Erez - Somthing is wrong with parsing tags
4. Check that everything work after login, and after refresh
   
Tag Rules
=========
* Location tag will show its asset, and not nested locations, unless the nested location set with a tag that fulfil the condition

