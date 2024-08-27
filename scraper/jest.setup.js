const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });

// Ensure console.log is not suppressed
console.log = console.log.bind(console);
console.error = console.error.bind(console);
