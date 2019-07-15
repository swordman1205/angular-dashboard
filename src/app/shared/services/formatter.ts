export namespace Formatter {

    // export const REGEX_PHYSICAL_ID = '^([0-9a-f]{2}:?){[maskBytesCount]}$';
    export const REGEX_PHYSICAL_ID = '^(([A-Fa-f0-9]{2}[-:]?){[maskBytesCount]}[A-Fa-f0-9]{2}[,]?)+$'; // var regexp = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
    //                                 ^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$
    //                                 ^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$
    // export const REGEX_PHYSICAL_ID = '^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$';
    // export const REGED_IBUTTON_ID = '^([0-9a-f]{2}:?){6}$';
    export const REGED_IBUTTON_ID = '^([A-Fa-f0-9]{2}:?){6}$';



}

