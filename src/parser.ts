import { SmartBuffer } from "smart-buffer";
import { isCountedType } from "./types";
import type { Struct } from "./types";

// values is a array that all members is a bigint, number a string but not a mix between those types
// if count is undefined that means the code should not expect a array coming out of it, instead it should expect an string (in C, a char) | bigint | number
// or else it will receive a string (in C, a char[]) | (bigint | number)[]
function aggregate(values: (bigint | number | string)[], count: number | undefined): string | bigint | number | (bigint | number)[]{
    if(count === undefined){
        return values[0];
    }
    if(typeof(values[0]) === "string"){
        return values.join("");
    }else{
        return values as (bigint | number)[];
    }
}
function parse<T extends string | number | bigint>(struct: Struct<T>, buf: Buffer | SmartBuffer){
    const smartBuf = (buf instanceof SmartBuffer) ? buf : SmartBuffer.fromBuffer(buf);
    const result = {};
    for(const key in struct){
        const type = struct[key];
        
        if(isCountedType in type){
            const values = [];
            for(let i=0;i<(type.count ?? 1);i++){
                const value = type.parser(smartBuf);
                values.push(value);
            }
            result[key] = aggregate(values, type.count);
            continue;
        }else{
            result[key] = parse(type, smartBuf);
        }
    }
    return result;
}

export default parse;