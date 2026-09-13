const BarkoderSDK = require('barkoder-wasm');
async function test() {
    try {
        const barkoder = await BarkoderSDK.initialize("your_license_key_here");
        console.log("Success!");
        process.exit(0);
    } catch(e) {
        console.error("Caught:", e);
        process.exit(1);
    }
}
test();
