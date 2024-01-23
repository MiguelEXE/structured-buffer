// run this code using:
// - npx tsx examples/parsing.ts
// - yarn tsx examples/parsing.ts
import { parse, int32_be } from "../src/lib";

const Vector3 = {
    X: int32_be,
    Y: int32_be,
    Z: int32_be
};

console.log(parse(Vector3, Buffer.of(0, 0, 0, 20, 0, 0, 0, 40, 0, 0, 0, 150)));