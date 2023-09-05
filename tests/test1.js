const lib = require("..");

const result = lib.parser.parse(Buffer.from("abcdef"), {
    abc: lib.types.uint16_le[3]
});
console.log(result);