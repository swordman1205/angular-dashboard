export const defaults = {
  'NAFEM_TRUE': 1,
  'NAFEM_FALSE': 2,
  'FLOAT_MIN_VALUE': -1000000000,
  'FLOAT_MAX_VALUE': 1000000000,
  'DEFAULT_PRECISION': 1,
  'DEFAULT_MINUTES_INTERVAL': 5,
  'COMPARISON_PRECISION': 0.00001,
  'MAX_CALIBRATIONS': 5,
  'MAP_DEFAULT_ZOOM': 3,
  'MAP_LOCATION_ZOOM': 10,
  'CHECK_TYPE_NUMERIC': 'Numeric',
  'CHECK_TYPE_MULTIPLE_CHOICE': 'Multiple Choice',
  'TEMP_MEASURE_UNIT_FAHRENHEIT': 'F',
  'TEMP_MEASURE_UNIT_CELSIUS': 'C',
  'CONFIG_LIST_WIDTH': 230,
  'WIDGET_LIST_WIDTH': 160,
  'NO_DATA': -9786.978
};




export const TIME_PERIODS =
  [
    { label: '4 Hours', minutes: 240 },
    { label: '1 Day', minutes: 1440 },
    { label: '1 Week', minutes: 10080 },
    { label: '1 Month', minutes: 44640 }
  ];




export const TIME_INTERVALS =
  [
    { label: 'Once', minutes: 0 },
    { label: 'Daily', minutes: 1440 },
    { label: 'Weekly', minutes: 10080 },
    { label: 'Monthly', minutes: 43200 },
    { label: 'Quarterly', minutes: 129600 },
    { label: 'Yearly', minutes: 525600 }
  ];



export const CALIBRATION_TYPES =
  [
    { label: 'Off', value: 0 },
    { label: '1 point (offset)', value: 1 },
    { label: '2 points', value: 2 },
    { label: '3 points', value: 3 },
    { label: '4 points', value: 4 },
    { label: '5 points', value: 5 }
  ];
