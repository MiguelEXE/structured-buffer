// run this code using:
// - npx tsx examples/calculating-type-size.ts
// - yarn tsx examples/calculating-type-size.ts
import { sizeof, char, uint8, int8, uint16_be, int16_be, uint16_le, int16_le, uint32_be, int32_be, uint32_le, int32_le, uint64_be, int64_be, uint64_le, int64_le } from "../src/lib";

const types = {char, uint8, int8, uint16_be, int16_be, uint16_le, int16_le, uint32_be, int32_be, uint32_le, int32_le, uint64_be, int64_be, uint64_le, int64_le};
for(const typeName in types){
    console.log(`Size of ${typeName} in bytes:  \t`, sizeof(types[typeName])); // double space and tab to ensure that the terminal (atleast xterm.js/vs code terminal) lines it up
}