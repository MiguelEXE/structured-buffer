const structBuf = require("..");
const {int64_be, int64_le} = require("../types.js");
const struct_string = {
    big_endian:         int64_be[2],
    little_endian:      int64_le[2]
};

// Converting a struct to buffer
const result = structBuf.creator.create(struct_string, {
    big_endian:         [5489147499103232n,4489147099173232n],
    little_endian:      [5489147499103232n,4489147099173232n]
});
console.log(result);
// Converting a buffer to struct
const result_converted = structBuf.parser.parse(result, struct_string);
console.log(result_converted); // should be noted that values converted from buffer are number arrays not strings