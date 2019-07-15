import {
    IJsonConfig,
    IEcsJsonParser,
    Constructor,
    IDeserializeSettings,
} from './io-interfaces';
import { JsonObjectMetadata } from './json-metadata';
import { Helpers } from './io-helpers';
import { FileHelpers } from '../../types/file-helper';







let configSettings: IJsonConfig = {
    enableTypeHints: true,
    typeHintPropertyKey: '__type'
};


abstract class Deserializer {


    // Start Deserialization Process
    // -------------------------------
    public static readObject<T>(json: string | Object, type: new() => T, config: IJsonConfig): T {
        let value: any;
        let instance: T;
        const metadata = JsonObjectMetadata.getFromType(type);

        if (typeof json === 'object') {
            value = json;
        } else {
            value = JSON.parse(json, config.reviver); // Parse text into basic object, which is then processed recursively.
        }

        if (typeof config.maxObjects === 'number') {
            if (this.countObjects(value) > config.maxObjects) {
                throw new Error(`JSON exceeds object count limit (${config.maxObjects}).`);
            }
        }

        // Read The Json data into new instabced Typed Object
        // -------------------------------------------------------
        instance = this.readJsonToInstance(value, {
            objectType: type,
            typeHintPropertyKey: config.typeHintPropertyKey,
            enableTypeHints: config.enableTypeHints,
            strictTypeHintMode: true,
            knownTypes: metadata ? metadata.knownTypes : {}
        });

        return instance;
    }


    private static countObjects(value: any): number {
        switch (typeof value) {
            case 'object':
                let count = 0;
                if (value === null) {
                    return count;
                } else if (Helpers.isArray(value)) {
                    // Count array elements.
                    value.forEach(item => {
                        count += this.countObjects(item);
                    });

                    return count;
                } else {
                    // Count object properties.
                    Object.keys(value).forEach(propertyKey => {
                        count += this.countObjects(value[propertyKey]);
                    });

                    return count;
                }

            case 'undefined':
                return 0;

            default: // Primitives.
                return 1;
        }
    }


    private static readJsonToInstance<T>(json: any, settings: IDeserializeSettings<T>): T {
        let resp: any;
        let respMetadata: JsonObjectMetadata<any>;
        let respType: Constructor<T>;
        let typeHint: string;
        let temp: any;
        // const knownTypes: { [name: string]: Constructor<any> } = {};


        if (!Helpers.valueIsDefined(json)) {
            if (settings.isRequired) {
                throw new Error(`Missing required member.`);
            }
            return json;
        } else if (Helpers.isPrimitive(settings.objectType)) {
            if (json.constructor !== settings.objectType) {
                const expectedTypeName = Helpers.getClassName(settings.objectType).toLowerCase();
                const foundTypeName = Helpers.getClassName(json.constructor).toLowerCase();
                throw new TypeError(`Expected value to be of type '${expectedTypeName}', got '${foundTypeName}'.`);
            }

            return json;
        }


        if (settings.objectType as any === Array) {
            if (!Helpers.isArray(json)) {
                if (json.hasOwnProperty('$values')) {
                    switch (json['$type']) {
                        case 'List`1': {
                                json = json['$values'];
                                break;
                            }
                    }
                } else {
                    throw new TypeError(`Expected value to be of type 'Array', got '${Helpers.getClassName(json.constructor)}'.`);
                }
            }

            resp = [];
            json.forEach((element: any) => {
                if (Helpers.isPrimitive(element)) {
                    // const ctor = element.constructor;
                    // const typeName = Helpers.getClassName(element.constructor).toLowerCase();
                    // const type = typeof element;

                    // if (settings.objectType as any === Date) {
                    //     if (typeof json === 'string') {
                    //         resp = new Date(json);
                    //     } else if (json instanceof Date) {
                    //         resp = json;
                    //     } else {
                    //         throw new TypeError('Expected value to be of type string, got' + typeof (json) + '.');
                    //     }
                    // }

                    resp.push(element);

                } else {
                    const elmntTypeName: string = element['$type'];
                    const type = FileHelpers.typeFactory(elmntTypeName);
                    const metadata = JsonObjectMetadata.getFromType(type);

                    resp.push(this.readJsonToInstance(element, {
                        objectType: type,
                        typeHintPropertyKey: settings.typeHintPropertyKey,
                        enableTypeHints: settings.enableTypeHints,
                        strictTypeHintMode: true,
                        knownTypes: metadata ? metadata.knownTypes : {}
                    }));
                }
            });
        } else if (settings.objectType as any === Date) {
            if (typeof json === 'string') {
                resp = new Date(json);
            } else if (json instanceof Date) {
                resp = json;
            } else {
                throw new TypeError('Expected value to be of type string, got' + typeof (json) + '.');
            }
        } else {
            // Default "Case" - Json data is of type Object
            typeHint = json[settings.typeHintPropertyKey];

            if (typeHint && settings.enableTypeHints) {
                if (typeof typeHint !== 'string') {
                    throw new TypeError(`Type-hint (${settings.typeHintPropertyKey}) must be a string.`);
                }

                // Check if type-hint refers to a known type.
                if (!settings.knownTypes[typeHint]) {
                    throw new Error(`'${typeHint}' is not a known type.`);
                }

                // In strict mode, check if type-hint is a subtype of the expected type.
                if (settings.strictTypeHintMode && !Helpers.isSubtypeOf(settings.knownTypes[typeHint], settings.objectType)) {
                    throw new Error(`'${typeHint}' is not a subtype of '${Helpers.getClassName(settings.objectType)}'.`);
                }

                respType = settings.knownTypes[typeHint];
                respMetadata = JsonObjectMetadata.getFromType(respType);
            } else {
                if (settings.enableTypeHints && settings.requireTypeHints) {
                    throw new Error('Missing required type-hint.');
                }

                respType = settings.objectType;
                respMetadata = JsonObjectMetadata.getFromType(settings.objectType);
            }

            if (respMetadata) {

                // The Response Type is Known and has Metadata (Usually Due to being the Root Object of the 'json' parameter)
                // -------------------------------------------------------------------------------------------------------------
                if (typeof respMetadata.deserializer === 'function') {
                    resp = respMetadata.deserializer(json) || null;
                } else {

                    // respMetadata.sortMembers();
                    resp = new respType();

                    Object.keys(respMetadata.dataMembers).forEach(propertyKey => {
                        const propertyMetadata = respMetadata.dataMembers[propertyKey];

                        temp = this.readJsonToInstance(json[propertyMetadata.name], {
                            elements: propertyMetadata.elements,
                            enableTypeHints: settings.enableTypeHints,
                            isRequired: propertyMetadata.isRequired,
                            knownTypes: Helpers.merge(settings.knownTypes, respMetadata.knownTypes || {}),
                            objectType: propertyMetadata.type,
                            requireTypeHints: settings.requireTypeHints,
                            strictTypeHintMode: settings.strictTypeHintMode,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });

                        if (Helpers.valueIsDefined(temp)) {
                            resp[propertyKey] = temp;
                        }
                    });
                }
            } else {

                // The Response Type is UN-Known and it's being INCAPSULATED as json OBJECT
                // ---------------------------------------------------------------------------
                if (json.hasOwnProperty('$type')) {
                    const typeName = json['$type'];

                    // Json Object is an Array of Un-Known Types Obvjects
                    if (typeName === 'List`1' && json.hasOwnProperty('$values')) {
                        resp = this.readJsonToInstance(json['$values'], {
                            enableTypeHints: settings.enableTypeHints,
                            knownTypes: settings.knownTypes,
                            objectType: Array,
                            requireTypeHints: settings.requireTypeHints,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });

                        return resp;
                    }

                    // Json Object is an Dictionary of Un-Known Types Objects
                    if (typeName === 'List`2' && json.hasOwnProperty('$values')) {
                        return json;
                    }

                    // Json Object is an Hashtable of Un-Known Types Objects
                    // (it has properties with $values Array inside each of which)
                    if (typeName === 'Hashtable') {
                        resp = {};
                        Object.keys(json).forEach(propertyKey => {
                            if (!propertyKey.startsWith('$')) {
                                if (json[propertyKey]['$type'] === 'List`1' && json[propertyKey].hasOwnProperty('$values')) {
                                    resp[propertyKey] = this.readJsonToInstance(json[propertyKey]['$values'], {
                                        enableTypeHints: settings.enableTypeHints,
                                        knownTypes: settings.knownTypes,
                                        objectType: Array,
                                        requireTypeHints: settings.requireTypeHints,
                                        typeHintPropertyKey: settings.typeHintPropertyKey
                                    });
                                } else if (json[propertyKey]['$type'] === 'List`2' && json[propertyKey].hasOwnProperty('$values')) {
                                    resp[propertyKey] = this.readJsonToInstance(json[propertyKey]['$values'], {
                                        enableTypeHints: settings.enableTypeHints,
                                        knownTypes: settings.knownTypes,
                                        objectType: Array,
                                        requireTypeHints: settings.requireTypeHints,
                                        typeHintPropertyKey: settings.typeHintPropertyKey
                                    });
                                }
                            }
                        });
                    }

                    // Json Object is an ArrayList of Un-Known Types Objects
                    // (it has properties with $values Array inside each of which)
                    if (typeName === 'ArrayList') {
                        resp = [];
                        if (json.hasOwnProperty('$values')) {
                            const arr: Array<any> = json['$values'];
                            for (let i = 0; i < arr.length; i++) {
                                resp[i] = this.readJsonToInstance(arr[i], {
                                    enableTypeHints: settings.enableTypeHints,
                                    knownTypes: settings.knownTypes,
                                    objectType: Object,
                                    requireTypeHints: settings.requireTypeHints,
                                    typeHintPropertyKey: settings.typeHintPropertyKey
                                });
                            }

                            return resp;
                        }
                    }

                    const type = FileHelpers.typeFactory(typeName);
                    if (type) {
                        const metadata = JsonObjectMetadata.getFromType(type);
                        resp = new type();
                    } else {
                        resp = {};
                    }
                } else {
                    resp = {};
                }

                Object.keys(json).forEach(propertyKey => {
                    if (propertyKey === '$values') {
                        resp[propertyKey] = this.readJsonToInstance(json[propertyKey], {
                            enableTypeHints: settings.enableTypeHints,
                            knownTypes: settings.knownTypes,
                            objectType: Array,
                            requireTypeHints: settings.requireTypeHints,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });
                    } else if (json[propertyKey] && propertyKey !== settings.typeHintPropertyKey) {
                        let objectType;
                        if (Helpers.valueIsDefined(json[propertyKey])) {
                            objectType = json[propertyKey].constructor;
                        }

                        // --------------------------
                        resp[propertyKey] = this.readJsonToInstance(json[propertyKey], {
                            enableTypeHints: settings.enableTypeHints,
                            knownTypes: settings.knownTypes,
                            objectType: objectType,
                            requireTypeHints: settings.requireTypeHints,
                            typeHintPropertyKey: settings.typeHintPropertyKey
                        });
                    }
                });
            }
        }

        return resp;
    }
}





export const ECSJson: IEcsJsonParser = {
    config: function (config: IJsonConfig) {
        configSettings = Helpers.merge(configSettings, config);
    },
    stringify: function (value: any, config?: IJsonConfig): string {
        return null;
    },
    parse: function (json: string, type?: any, config?: IJsonConfig): any {
        if (JsonObjectMetadata.getFromType(type)) {
            return Deserializer.readObject(json, type, Helpers.merge(configSettings, config || {}));
        } else {
            return JSON.parse.apply(JSON, [arguments[0], config && config.reviver]);
        }
    }
};
