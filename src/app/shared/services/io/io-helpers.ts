import { Constructor, METADATA_FIELD_KEY } from './io-interfaces';





export namespace Helpers {

    export function error(message?: any, ...optionalParams: Array<any>) {
        if (typeof console === 'object' && typeof console.error === 'function') {
            console.error.apply(console, [message].concat(optionalParams));
        } else if (typeof console === 'object' && typeof console.log === 'function') {
            console.log.apply(console, ['ERROR: ' + message].concat(optionalParams));
        }
    }


    export function warn(message?: any, ...optionalParams: Array<any>) {
        if (typeof console === 'object' && typeof console.warn === 'function') {
            console.warn.apply(console, [message].concat(optionalParams));
        } else if (typeof console === 'object' && typeof console.log === 'function') {
            console.log.apply(console, ['WARNING: ' + message].concat(optionalParams));
        }
    }


    export function log(message?: any, ...optionalParams: Array<any>) {
        if (typeof console === 'object' && typeof console.log === 'function') {
            console.log.apply(console, [message].concat(optionalParams));
        }
    }





    // Polyfill for Object.assign.
    // -----------------------------------------------------
    export function assign<T extends Object>(target: T, ...sources: Array<any>): T {
        let output: T;
        let source: any;

        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        output = Object(target);

        for (let i = 1; i < arguments.length; i++) {
            source = arguments[i];

            if (source !== undefined && source !== null) {
                for (const nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }

        return output;
    }





    export function getClassName(target: Constructor<any>): string;


    // tslint:disable-next-line:unified-signatures
    export function getClassName(target: Object): string;

    export function getClassName(target: Constructor<any> | Object): string {
        let targetType: Constructor<any>;

        if (typeof target === 'function') {
            // target is constructor function.
            targetType = target as Constructor<any>;
        } else if (typeof target === 'object') {
            // target is class prototype.
            targetType = target.constructor as Constructor<any>;
        }

        if (!targetType) {
            return 'undefined';
        }

        if ('name' in targetType && typeof (targetType as any).name === 'string') {
            return (targetType as any).name;
        } else {
            return targetType.toString().match(/function (\w*)/)[1];
        }
    }

    export function getDefaultValue<T>(type: new() => T): T {
        switch (type as any) {
            case Number:
                return 0 as any;

            case String:
                return '' as any;

            case Boolean:
                return false as any;

            case Array:
                return [] as any;

            default:
                return null;
        }
    }

    export function getPropertyDisplayName(target: Constructor<any> | Object, propertyKey: string | symbol) {
        return `${getClassName(target)}.${propertyKey.toString()}`;
    }

    export function isArray(object: any) {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(object);
        } else {
            if (object instanceof Array) {
                return true;
            } else {
                return false;
            }
        }
    }

    export function isPrimitive(obj: any) {
        switch (typeof obj) {
            case 'string':
            case 'number':
            case 'boolean':
                return true;
        }

        if (obj instanceof String || obj === String ||
            obj instanceof Number || obj === Number ||
            obj instanceof Boolean || obj === Boolean
        ) {
            return true;
        }

        return false;
    }

    export function isReservedMemberName(name: string) {
        return (name === METADATA_FIELD_KEY);
    }

    export function isSubtypeOf(A: Constructor<any>, B: Constructor<any>) {
        return A === B || A.prototype instanceof B;
    }


    // Copy the values of all enumerable own properties from one or more source objects to a shallow copy of the target object.
    // It will return the new object.
    export function merge<T extends Object>(target: T, ...sources: Array<any>): T {
        let output: T;
        let source: any;

        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        output = {} as T;

        Object.keys(target).forEach(nextKey => {
            output[nextKey] = target[nextKey];
        });

        for (let i = 1; i < arguments.length; i++) {
            source = arguments[i];

            if (source !== undefined && source !== null) {
                for (const nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }

        return output;
    }

    export function valueIsDefined(value: any): boolean {
        if (typeof value === 'undefined' || value === null) {
            return false;
        } else {
            return true;
        }
    }
}
