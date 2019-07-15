import {NAMED_COLORS} from './colors';

export const StatusViews = {
    0: {caption: 'N/A', color: NAMED_COLORS.GRAY},
    100: {caption: 'OK', color: NAMED_COLORS.GREEN},
    113: {caption: 'Alarm Snooze', color: NAMED_COLORS.GREEN},
    115: {caption: 'Alarm Bypass', color: NAMED_COLORS.GREEN},
    117: {caption: 'Alarm', color: NAMED_COLORS.GREEN},
    122: {caption: 'Warning (Ack)', color: NAMED_COLORS.GREEN},
    124: {caption: 'Critical (Ack)', color: NAMED_COLORS.GREEN},
    125: {caption: 'Fault (Ack)', color: NAMED_COLORS.GREEN},
    126: {caption: 'Fault Open (Ack)', color: NAMED_COLORS.GREEN},
    127: {caption: 'Fault Shorted (Ack)', color: NAMED_COLORS.GREEN},
    128: {caption: 'Fault Communication (Ack)', color: NAMED_COLORS.GREEN},
    129: {caption: 'Disconnected (Ack)', color: NAMED_COLORS.GREEN},
    200: {caption: 'Warning', color: NAMED_COLORS.YELLOW},
    400: {caption: 'Critical', color: NAMED_COLORS.RED},
    500: {caption: 'Fault', color: NAMED_COLORS.RED},
    600: {caption: 'Fault Open', color: NAMED_COLORS.RED},
    700: {caption: 'Fault Shorted', color: NAMED_COLORS.RED},
    800: {caption: 'Fault Communication', color: NAMED_COLORS.RED},
    900: {caption: 'Disconnected', color: NAMED_COLORS.BLUE},
    1010: {caption: 'Router Disconnected', color: NAMED_COLORS.BLUE},
    1020: {caption: 'Router Charging Fault', color: NAMED_COLORS.RED},
    1030: {caption: 'Router Power Alert', color: NAMED_COLORS.RED}
};
