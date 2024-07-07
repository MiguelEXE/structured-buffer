// run this code using:
// - npx tsx examples/unix-ints.ts
// - yarn tsx examples/unix-ints.ts
import { parse, write, pdp_int32, pdp_uint32 } from "..";
import { format } from "util";

const ExampleUnsignedStruct = {
    exampleInteger: pdp_uint32,
};

const exampleBuf = Buffer.of(0x34, 0x12, 0x78, 0x56);
// 0x34 0x12 is the high short and corresponds to 0x1234
// 0x78 0x56 is the low short and corresponds to 0x5678
// for more information, go to https://man.archlinux.org/man/cpio.5.en in PWD format

const result = parse(ExampleUnsignedStruct, exampleBuf) as any;

console.log(`Example buffer: ${format(exampleBuf)}.\nParsed integer: 0x${result.exampleInteger.toString(16)}\n`);

const exampleInteger = 0x87654321;
const resultBuf = write(ExampleUnsignedStruct, {
    exampleInteger
}) as any;
console.log(`Example integer: 0x${exampleInteger.toString(16)}.\nOutput buffer: ${format(resultBuf)}`);