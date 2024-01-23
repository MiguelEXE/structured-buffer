// run this code using:
// - npx tsx examples/big-vs-little.ts
// - yarn tsx examples/big-vs-little.ts
import { write, parse, int16_be, int16_le } from "../src/lib";

const sampleStructBig = {
    value: int16_be
};
const sampleStructLittle = {
    value: int16_le
};
const sample = Buffer.of(20, 40);
const sample2 = 0x4050;
console.log("Sample (parsing):", sample);
console.log("Big endian (parsing):", parse(sampleStructBig, sample));
console.log("Little endian (parsing):", parse(sampleStructLittle, sample));
console.log();
console.log(`Sample (writing): 0x${sample2.toString(16)}`);
console.log("Big endian (writing):", write(sampleStructBig, {value: sample2}));
console.log("Little endian (writing):", write(sampleStructLittle, {value: sample2}));