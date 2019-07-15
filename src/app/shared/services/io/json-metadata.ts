import { IJsonObject, Constructor, IJsonProperty, METADATA_FIELD_KEY, IJsonPropertyMetadata } from './io-interfaces';
import { Helpers } from './io-helpers';







declare abstract class Reflect {
    public static getMetadata(metadataKey: string, target: any, targetKey: string | symbol): any;
}









// JsonObject
// -----------------------------------------------
export class JsonObjectMetadata<T> {
    private _className: string;
    private _dataMembers: { [key: string]: JsonPropertyMetadata<any> };
    private _knownTypes: Array<Constructor<any>>;
    private _knownTypeCache: { [key: string]: Constructor<any> };

    public classType: Constructor<T>; // Gets or sets the constructor function for the JsonObject.
    public isExplicitlyMarked: boolean;
    public deserializer: (json: any) => T;
    public serializer: (object: T) => any;




    constructor() {
        this._dataMembers = {};
        this._knownTypes = [];
        this._knownTypeCache = null;
        this.isExplicitlyMarked = false;
    }





    // Gets the name of a class as it appears in a serialized JSON string.
    public static getJsonObjectName(type: Constructor<any>, inherited: boolean = true): string {

        const metadata = this.getFromType(type, inherited);

        if (metadata !== null) {
            return metadata.className;
        } else {
            return Helpers.getClassName(type);
        }
    }


    // Gets JsonObject metadata information from a class or its prototype.
    public static getFromType<S>(target: new() => S, inherited?: boolean): JsonObjectMetadata<S>;


    // Gets JsonObject metadata information from a class or its prototype.
    public static getFromType(target: any, inherited?: boolean): JsonObjectMetadata<any>;


    public static getFromType<S>(target: (new() => S) | any, inherited: boolean = true): JsonObjectMetadata<S> {

        let targetPrototype: any;
        let metadata: JsonObjectMetadata<S>;

        if (typeof target === 'function') {
            targetPrototype = target.prototype;
        } else {
            targetPrototype = target;
        }

        if (!targetPrototype) {
            return null;
        }

        if (targetPrototype.hasOwnProperty(METADATA_FIELD_KEY)) {
            // The class prototype contains own JsonObject metadata.
            metadata = targetPrototype[METADATA_FIELD_KEY];
        } else if (inherited && targetPrototype[METADATA_FIELD_KEY]) {
            // The class prototype inherits JsonObject metadata.
            metadata = targetPrototype[METADATA_FIELD_KEY];
        }

        if (metadata && metadata.isExplicitlyMarked) {
            // Ignore implicitly added JsonObject.
            return metadata;
        } else {
            return null;
        }
    }

    // Gets JsonObject metadata information from a class instance.
    public static getFromInstance<S>(target: S, inherited: boolean = true): JsonObjectMetadata<S> {
        return this.getFromType<S>(Object.getPrototypeOf(target), inherited);
    }


    public static getKnownTypeNameFromType<S>(target: Constructor<S>): string {
        const metadata = this.getFromType<S>(target, false);
        if (metadata) {
            return metadata.className;
        } else {
            return Helpers.getClassName(target);
        }
    }


    public static getKnownTypeNameFromInstance<S>(target: S): string {
        const metadata = this.getFromInstance<S>(target, false);
        if (metadata) {
            return metadata.className;
        } else {
            return Helpers.getClassName(target.constructor);
        }
    }


    // Gets the metadata of all JsonProperty of the JsonObject as key-value pairs. */
    public get dataMembers(): { [key: string]: JsonPropertyMetadata<any> } {
        return this._dataMembers;
    }


    public get className(): string {
        if (typeof this._className === 'string') {
            return this._className;
        } else {
            return Helpers.getClassName(this.classType);
        }
    }
    public set className(value: string) {
        this._className = value;
    }


    public get knownTypes() {
        let knownTypes: { [key: string]: Constructor<any> };
        let knownTypeName: string;

        knownTypes = {};

        this._knownTypes.forEach((knownType) => {
            // KnownType names are not inherited from JsonObject settings.
            knownTypeName = JsonObjectMetadata.getKnownTypeNameFromType(knownType);
            knownTypes[knownTypeName] = knownType;
        });

        this._knownTypeCache = knownTypes;

        return knownTypes;
    }


    // Sets a known type.
    public setKnownType(type: Constructor<any>): void {
        if (this._knownTypes.indexOf(type) === -1) {
            this._knownTypes.push(type);
            this._knownTypeCache = null;
        }
    }


    // Adds a JsonProperty to the JsonObject.
    public addMember<U>(member: JsonPropertyMetadata<U>) {
        Object.keys(this._dataMembers).forEach(prop => {
            if (this._dataMembers[prop].name === member.name) {
                throw new Error(`A member with the name '${member.name}' already exists.`);
            }
        });

        this._dataMembers[member.key] = member;
    }
}



//  Specifies that the type is serializable to and deserializable from a JSON string.
export function JsonObject<T>(options?: IJsonObject<T>): (target: new() => T) => void;

export function JsonObject<T>(target: new() => T): void;

export function JsonObject<T>(optionsOrTarget?: IJsonObject<T> | (new() => T)): (target: Constructor<T>) => void | void {
    let options: IJsonObject<T>;

    if (typeof optionsOrTarget === 'function') {
        // JsonObject is being used as a decorator, directly.
        options = {};
    } else {
        // JsonObject is being used as a decorator factory.
        options = optionsOrTarget || {};
    }

    const deserializer = options.deserializer;
    const decorator = function (target: Constructor<T>): void {
        let objectMetadata: JsonObjectMetadata<T>;
        let parentMetadata: JsonObjectMetadata<T>;
        let i;

        if (!target.prototype.hasOwnProperty(METADATA_FIELD_KEY)) {
            objectMetadata = new JsonObjectMetadata<T>();

            // If applicable, inherit @JsonProperty and @KnownTypes from parent @JsonObject.
            if (parentMetadata = target.prototype[METADATA_FIELD_KEY]) {
                Object.keys(parentMetadata.dataMembers).forEach(memberPropertyKey => {
                    objectMetadata.dataMembers[memberPropertyKey] = parentMetadata.dataMembers[memberPropertyKey];
                });

                // @KnownTypes
                Object.keys(parentMetadata.knownTypes).forEach(key => {
                    objectMetadata.setKnownType(parentMetadata.knownTypes[key]);
                });
            }

            Object.defineProperty(target.prototype, METADATA_FIELD_KEY, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: objectMetadata
            });
        } else {
            objectMetadata = target.prototype[METADATA_FIELD_KEY];
        }

        objectMetadata.classType = target;
        objectMetadata.isExplicitlyMarked = true;

        if (options.name) {
            objectMetadata.className = options.name;
        }

        if (options.knownTypes) {
            i = 0;

            try {
                options.knownTypes.forEach(knownType => {
                    if (typeof knownType === 'undefined') {
                        throw new TypeError(`Known type #${i++} is undefined.`);
                    }

                    objectMetadata.setKnownType(knownType);
                });
            } catch (e) {
                // The missing known type might not cause trouble at all, thus the error is printed, but not thrown.
                Helpers.error(new TypeError(`@JsonObject: ${e.message} (on '${Helpers.getClassName(target)}')`));
            }
        }

        if (typeof deserializer === 'function') {
            objectMetadata.deserializer = deserializer;
        }
    };

    if (typeof optionsOrTarget === 'function') {
        // JsonObject is being used as a decorator, directly.
        return decorator(optionsOrTarget as Constructor<T>) as any;
    } else {
        // JsonObject is being used as a decorator factory.
        return decorator;
    }
}







// Property Metadata
// -----------------------------------------------
export class JsonPropertyMetadata<T> implements IJsonPropertyMetadata<T> {
    public setDefaultVal: boolean;
    public name: string;
    public key: string;
    public type: Constructor<T>;
    public isRequired?: boolean;
    public elements?: IJsonPropertyMetadata<T>;
}



export function JsonProperty(): PropertyDecorator;

export function JsonProperty(target: any, prop: string | symbol): void;

export function JsonProperty<TFunc extends Function>(options: IJsonProperty<TFunc>): PropertyDecorator;

export function JsonProperty<TFunc extends Function>(
    optionsOrTarget?: IJsonProperty<TFunc> | any,
    prop?: string | symbol): PropertyDecorator | void {

    let memberMetadata = new JsonPropertyMetadata<TFunc>();
    let options: IJsonProperty<TFunc>;
    let decorator: PropertyDecorator;

    if (typeof prop === 'string' || typeof prop === 'symbol') {
        // JsonProperty is being used as a decorator, directly.
        options = {};
    } else {
        // JsonProperty is being used as a decorator factory.
        options = optionsOrTarget || {};
    }

    decorator = function (target: any, propr: string | symbol): void {
        const descriptor = Object.getOwnPropertyDescriptor(target, propr.toString());
        let objectMetadata: JsonObjectMetadata<any>;
        let parentMetadata: JsonObjectMetadata<any>;
        let reflectType: any;
        const propertyName = Helpers.getPropertyDisplayName(target, propr); // For error messages.


        if (typeof target === 'function') {
            // The property decorator is applied to a static member.
            throw new TypeError(`@JsonProperty cannot be used on a static property ('${propertyName}').`);
        }

        // Methods cannot be serialized.
        if (typeof target[propr] === 'function') {
            throw new TypeError(`@JsonProperty cannot be used on a method property ('${propertyName}').`);
        }

        memberMetadata = Helpers.assign(memberMetadata, options);
        memberMetadata.key = propr.toString();
        memberMetadata.name = options.name || propr.toString(); // Property key is used as default member name if not specified.

        // Check for reserved member names.
        if (Helpers.isReservedMemberName(memberMetadata.name)) {
            throw new Error(`@JsonProperty: '${memberMetadata.name}' is a reserved name.`);
        }

        // It is a common error for types to exist at compile time, but not at runtime (often caused by improper/misbehaving imports).
        if (options.hasOwnProperty('type') && typeof options.type === 'undefined') {
            throw new TypeError(`@JsonProperty: 'type' of '${propertyName}' is undefined.`);
        }

        // ReflectDecorators support to auto-infer property types.
        if (typeof Reflect === 'object' && typeof Reflect.getMetadata === 'function') {
            reflectType = Reflect.getMetadata('design:type', target, propr);

            if (typeof reflectType === 'undefined') {
                throw new TypeError(`@JsonProperty: type detected for '${propertyName}' is undefined.`);
            }

            if (!memberMetadata.type || typeof memberMetadata.type !== 'function') {
                // Get type information using reflect metadata.
                memberMetadata.type = reflectType;
            } else if (memberMetadata.type !== reflectType) {
                Helpers.warn(`@JsonProperty: 'type' specified for '${propertyName}' does not match detected type.`);
            }
        }

        initJsonPropertyType(memberMetadata, propertyName);

        // Add JsonObject metadata to 'target' if not yet exists ('target' is the prototype).
        if (!target.hasOwnProperty(METADATA_FIELD_KEY)) {
            // There's NO 'this' metadata, create new.
            objectMetadata = new JsonObjectMetadata();

            // Inherit @JsonProperty from parent @JsonObject, if any.
            if (parentMetadata = target[METADATA_FIELD_KEY]) {
                Object.keys(parentMetadata.dataMembers).forEach(memberPropertyKey => {
                    objectMetadata.dataMembers[memberPropertyKey] = parentMetadata.dataMembers[memberPropertyKey];
                });
            }

            // ('target' is the prototype of the involved class, metadata information is added to the class prototype).
            Object.defineProperty(target, METADATA_FIELD_KEY, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: objectMetadata
            });
        } else {
            // JsonObjectMetadata already exists on 'target'.
            objectMetadata = target[METADATA_FIELD_KEY];
        }

        // Automatically add known types.
        getKnownTypes(memberMetadata).forEach(knownType => {
            objectMetadata.setKnownType(knownType);
        });

        try {
            objectMetadata.addMember(memberMetadata);
        } catch (e) {
            throw new Error(`Member '${memberMetadata.name}' already exists on '${Helpers.getClassName(objectMetadata.classType)}'.`);
        }
    };

    if (typeof prop === 'string' || typeof prop === 'symbol') {
        // JsonProperty is being used as a decorator, call decorator function directly.
        return decorator(optionsOrTarget, prop);
    } else {
        // JsonProperty is being used as a decorator factory, return decorator function.
        return decorator;
    }
}




export function initJsonPropertyType<T>(metadata: JsonPropertyMetadata<T>, propertyName: string, warnArray = false) {
    if (metadata.elements) {
        if (typeof metadata.elements === 'function') {
            metadata.elements = {
                type: metadata.elements
            } as any;
        }

        if (!metadata.type) {
            metadata.type = Array as any;
        }
    }

    if (metadata.type as any === Array) {
        if (!metadata.elements) {
            if (warnArray) {
                Helpers.warn(`No valid 'elements' option was specified for '${propertyName}'.`);
            } else {
                throw new Error(`No valid 'elements' option was specified for '${propertyName}'.`);
            }
        } else {
            initJsonPropertyType(metadata.elements, propertyName + '[]', true);
        }
    }

    if (typeof metadata.type !== 'function') {
        throw new Error(`No valid 'type' option was specified for '${propertyName}'.`);
    }
}


export function getKnownTypes<T>(metadata: JsonPropertyMetadata<T>) {
    let knownTypes = new Array<new() => any>();
    knownTypes.push(metadata.type);

    if (metadata.elements) {
        knownTypes = knownTypes.concat(getKnownTypes(metadata.elements));
    }

    return knownTypes;
}
