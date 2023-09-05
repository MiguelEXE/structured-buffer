const structBuf = require("..");
const {int32_be, int32_le} = require("../types.js");
const struct_string = {
    big_endian:         int32_be[2],
    little_endian:      int32_le[2]
};

// Converting a struct to buffer
const result = structBuf.creator.create(struct_string, {
    big_endian:         [10030243,14430240],
    little_endian:      [10030243,14430240]
});
console.log(result);
// Converting a buffer to struct
const result_converted = structBuf.parser.parse(result, struct_string);
console.log(result_converted); // should be noted that values converted from buffer are number arrays not strings