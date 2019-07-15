


export const METADATA_FIELD_KEY = '_ecstypesjsonserializer_';



export interface IEcsJsonParser {

    // Stringy - Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    // ---------------------------------------------------------------------------------------
    stringify(value: any): string;

    stringify(value: any, configs?: IJsonConfig): string;

    stringify(value: any, replacer: (key: string, value: any) => any): string;

    stringify(value: any, replacer: any[]): string;

    stringify(value: any, replacer: (key: string, value: any) => any, space: string | number): string;

    stringify(value: any, replacer: any[], space: string | number): string;



    // Parse - Converts a JavaScript Object Notation (JSON) string into an object.
    // If a member contains nested objects, the nested objects are transformed before the parent object is.
    parse(text: string, reviver?: (key: any, value: any) => any): any;

    parse<T>(text: string, type: new() => T, configs?: IJsonConfig): T;



    // Configures IEcsJsonParser with custom IJsonConfig object. New Configuration will be assigned to existing IJsonConfig.
    config(configs: IJsonConfig): void;
}



export interface IJsonConfig {
    // disable TypeScript 2.4+ Weak Type Detection (a type where *all* properties are optional)
    [prop: string]: any;
    typeHintPropertyKey?: string; // Default is '__type'.
    enableTypeHints?: boolean; // Default is true
    maxObjects?: number;
    replacer?: (key: string, value: any) => any; // Run after serializing
    reviver?: (key: any, value: any) => any;  // transforms the JSON before deserializing
}



// Represent a Decorator for DTO class
// ---------------------------------------
export interface IJsonObject<T> {
    name?: string;
    knownTypes?: Array<new() => any>;
    serializer?: (object: T) => any;
    deserializer?: (json: any) => T;
}



// Represent a Definition for DTO's Property
// ------------------------------------------
export interface IJsonProperty<TFunc extends Function> {
    name?: string;
    type?: TFunc;
    elements?: IJsonProperty<any> | Function;
    isRequired?: boolean;
}



export interface IJsonPropertyMetadata<T> {
    setDefaultVal: boolean;
    name: string;
    key: string;
    type: Constructor<T>;
    isRequired?: boolean;
    elements?: IJsonPropertyMetadata<any>;
}


// Settings for ECS Json Serializer
// ---------------------------------------
export interface ISerializeSettings {
    objectType: new() => any;
    elements?: IJsonPropertyMetadata<any>;
    enforceDefault?: boolean;
    typeHintPropertyKey: string;
    enableTypeHints?: boolean;
    requireTypeHints?: boolean;
    name?: string;
}



export interface IDeserializeSettings<T> {
    objectType: new() => T;
    isRequired?: boolean;
    elements?: IJsonPropertyMetadata<any>;
    typeHintPropertyKey: string;
    enableTypeHints?: boolean;
    knownTypes?: { [name: string]: new() => any };
    requireTypeHints?: boolean;
    strictTypeHintMode?: boolean;
}



export type Constructor<T> = new() => T;
