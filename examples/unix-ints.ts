// run this code using:
// - npx tsx examples/unix-ints.ts
// - yarn tsx examples/unix-ints.ts
import { parse, write, pdp_int32, pdp_uint32 } from "..";
import { format } from "util";

const ExampleSignedStruct = {
    exampleInteger: pdp_int32,
};

const exampleBuf = Buffer.of(0x34, 0x82, 0x78, 0x56); // 0x82 should make it negative and remove the 0x1 from 0x12 (AKA -0x02)
// 0x34 0x12 is the high short and corresponds to 0x1234
// 0x78 0x56 is the low short and corresponds to 0x5678
// for more information, go to https://man.archlinux.org/man/cpio.5.en in PWD format

const result = parse(ExampleSignedStruct, exampleBuf) as any;

console.log(`Example buffer: ${format(exampleBuf)}.\nParsed integer: ${result.exampleInteger < 0 ? "-" : ""}0x${Math.abs(result.exampleInteger).toString(16)}\n`);

const exampleInteger = -0x07654321; // sample integer from unix-uints.ts
const resultBuf = write(ExampleSignedStruct, {
    exampleInteger
}) as any;
console.log(`Example integer: ${exampleInteger < 0 ? "-" : ""}0x${Math.abs(exampleInteger).toString(16)}.\nOutput buffer: ${format(resultBuf)}`);