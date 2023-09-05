const structBuf = require("..");
const {int8} = require("../types.js");
const struct_string = {
    string_example:     int8[4],
    other_example:      int8[5]
};

// Converting a struct to buffer
const result = structBuf.creator.create(struct_string, {
    string_example:     "test",
    other_example:      "examp"
});
console.log(result);
// Converting a buffer to struct
const result_converted = structBuf.parser.parse(result, struct_string);
console.log(result_converted); // should be noted that values converted from buffer are number arrays not strings