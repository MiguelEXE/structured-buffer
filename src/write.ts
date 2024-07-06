import { SmartBuffer } from "smart-buffer";
import { isCountedType } from "./types";
import { notStrictEqual, deepStrictEqual, ok as assert } from "assert/strict";
import type { Struct, CountedType } from "./types";

interface StructObject{
    [key: string]: string | number | bigint | boolean | (number | boolean | bigint)[] | StructObject;
}
// WARNING: recursive function, given a struct, it can give a maxium call stack exceeded
// I know that this is gore code but I dont know how to break down this function so... take this
// Check if object is "typed well" with struct AKA if the object follows the struct type
function checkType(struct: Struct | CountedType<string | number | bigint | boolean>, object: StructObject, fromKey: string | undefined): void{
    for(const key in object){
        const value = struct[key] as Struct | CountedType<string | number | bigint> | undefined;
        const keyPad = (key !== undefined) ? `[${JSON.stringify(key)}]` : "";
        notStrictEqual(value, undefined, new TypeError(`Value of struct${keyPad} is undefined.`));
        if(isCountedType in value){ // value is a type
            if(value.count === undefined){ // if is not a array type
                assert(!Array.isArray(object[key]), new TypeError(`Expected ${value.valueType} from object[${JSON.stringify(key)}]. Received array.`));
                deepStrictEqual(typeof(object[key] as string | number | bigint), value.valueType, new TypeError(`Expected ${value.valueType} from object[${JSON.stringify(key)}]. Received ${typeof(object[key])}.`));
                if(typeof(object[key]) === "string"){
                    deepStrictEqual((object[key] as string).length, 1, new RangeError(`String object[${JSON.stringify(key)}] should have a length 1. Received string which length is ${(object[key] as string).length}`));
                }
                continue;
            }
            // is a array type
            if(typeof(object[key]) === "string"){
                deepStrictEqual((object[key] as string).length, value.count, new RangeError(`Expected an string of length ${value.count}. Received an array of length ${(object[key] as Array<any>).length}.`));
                continue;
            }
            
            assert(Array.isArray(object[key]), new TypeError(`Expected array from object[${JSON.stringify(key)}]. Received ${typeof(object[key])}.`));
            deepStrictEqual((object[key] as Array<any>).length, value.count, new RangeError(`Expected an array of length ${value.count}. Received an array of length ${(object[key] as Array<any>).length}.`));
            for(const objectValue of (object[key] as Array<any>)){
                deepStrictEqual(typeof(objectValue), value.valueType, new TypeError(`Expected ${value.valueType} from array. Received ${typeof(objectValue)}`));
            }
        }else{ // value is a struct
            deepStrictEqual(typeof(object[key]), "object", new TypeError("Expected object."));
            checkType(value, object[key] as StructObject, key);
        }
    }
}
function toArray(value: string | bigint | number | (bigint | number)[]){
    if(typeof(value) === "string"){ // both char and char() works since char can be a string of length 1 and char() can be a string of any length
        return value;
    }
    return Array.isArray(value) ? value : [value];
}
// WARNING: recursive function, given a struct, it can give a maxium call stack exceeded
/**
 * Transforms `object` into a buffer using `struct` as template
 * @param struct Struct which the writer will use to write the buffer
 * @param object `struct`-alike structure but with values properly declared
 * @param __checkType DO NOT DECLARE THIS VALUE. If false, will not check if `object` is respecting `struct` structure
 * @returns A buffer which corresponds to the `struct` structure with `object` values
 */
function write(struct: Struct, object: StructObject, __checkType?: boolean): Buffer{
    const smartBuf = new SmartBuffer();
    if(__checkType !== false) checkType(struct, object, undefined);
    for(const key in object){
        const structOrType = struct[key] as Struct | CountedType<string | number | bigint>;
        if(isCountedType in structOrType){ // Here the structOrType is a CountedType (both array or not)
            const args = toArray(object[key] as string | number | bigint | (bigint | number)[]);
            for(let i=0;i<(structOrType.count ?? 1);i++){
                structOrType.writer(smartBuf, args[i]);
            }
        }else{ // Here the structOrType is a Struct
            smartBuf.writeBuffer(write(structOrType, object[key] as StructObject, false));
        }
    }
    return smartBuf.toBuffer();
}

export type { StructObject };
export default write;