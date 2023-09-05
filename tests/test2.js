const lib = require("..");

const result = lib.creator.create({
    abc: lib.types.uint8[3]
}, {
    abc: "abc"
});
console.log(result);