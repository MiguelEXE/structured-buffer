import { SmartBuffer } from "smart-buffer";
import { isCountedType } from "./types";
import { default as sizeof } from "./sizeof"
import type { Struct } from "./types";

// values is a array that all members is a bigint, number, a string but not a mix between those types
// if count is undefined that means the code should not expect a array coming out of it, instead it should expect an 1-length string (in C, a char) | bigint | number
// or else it will receive a string (in C, a char[]) | (bigint | number)[]
function aggregate(values: (bigint | number | string | boolean)[], count: number | undefined): string | boolean | bigint | number | (bigint | number | boolean)[]{
    if(count === undefined){ // it's a 1-length string
        return values[0];
    }
    if(typeof(values[0]) === "string"){ // its a char[], for the decency, it will automatically convert to string
        return values.join("");
    }
    return values as (bigint | number)[]; // otherwise it's a number array
}
// WARNING: recursive function, given a struct, it can give a maxium call stack exceeded
/**
 * Parses a buffer using `struct` as a template
 * @param struct Struct which the parser will use as template to parse `buf`
 * @param buf Buffer or SmartBuffer instance which will be used
 * @param __checkSize DO NOT DECLARE THIS VALUE. If false, will not check if the size of struct is greater than the length of `buf`
 * @returns `struct`-alike object but with all the types converted to it's respectfully values
 */
function parse(struct: Struct, buf: Buffer | SmartBuffer, __checkSize?: boolean){
    const smartBuf = (buf instanceof SmartBuffer) ? buf : SmartBuffer.fromBuffer(buf);
    if(__checkSize !== false && sizeof(struct) > smartBuf.length){
        throw new RangeError("Size of struct is greater than length of buffer");
    }
    const result = {};
    for(const key in struct){
        const structOrType = struct[key];
        
        if(isCountedType in structOrType){ // Here the structOrType is a CountedType
            const values = [];
            for(let i=0;i<(structOrType.count ?? 1);i++){
                const value = structOrType.parser(smartBuf);
                values.push(value);
            }
            result[key] = aggregate(values, structOrType.count);
        }else{ // Here the structOrType is a Struct
            result[key] = parse(structOrType, smartBuf);
        }
    }
    return result;
}

export default parse;