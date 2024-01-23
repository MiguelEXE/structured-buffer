// run this code using:
// - npx tsx examples/simple-string.ts
// - yarn tsx examples/simple-string.ts
import { write, parse, char } from "../src/lib";

const sampleStruct = {
    message: char(23) // our message has a length of 23 (if ignoring any null bytes whatsoever)
};
const sampleStruct2 = {
    message: char(25) // another message that has 25 of length
};
const sample = Buffer.of(72, 101, 108, 108, 111, 32, 83, 116, 114, 117, 99, 116, 117, 114, 101, 100, 32, 87, 111, 114, 108, 100, 33);
console.log(parse(sampleStruct, sample)); // { message: 'Hello Structured World!' }
console.log(write(sampleStruct2, { // Goodbye Structured World! as buffer
    message: "Goodbye Structured World!"
}));