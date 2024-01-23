// run this code using:
// - npx tsx examples/writing.ts
// - yarn tsx examples/writing.ts
import { write, char, int16_be } from "../src/lib";

const User = {
    id: int16_be,
    username: char(20),
    bio: char(60)
};

console.log(write(User, {
    id: 20,
    username: "John Smith".padEnd(20, "\0"),
    bio: "I am a professional musician. Interested on illustration.".padEnd(60, "\0")
}));