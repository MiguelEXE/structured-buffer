import { isCountedType } from "./types";
import type { Struct } from "./types";

/**
 * Returns the size of the struct in bytes.
 * @param struct Struct which the sizeof will calculate the size
 * @returns The size of the struct in bytes
 */
function sizeof(struct: Struct): number{
    let size = 0;
    for(const key in struct){
        const structOrType = struct[key];
        
        if(isCountedType in structOrType){
            // If the CountedType is a Type. count will always be undefined
            // (in another words. If the person uses `type` instead `type(size)`).
            // count will be undefined,
            // this is done so we dont treat `type(1)` as not being an array
            // or `type` being an array
            size += structOrType.byteLength * (structOrType.count ?? 1);
        }else{
            size += sizeof(structOrType);
        }
    }
    return size;
}

export default sizeof;