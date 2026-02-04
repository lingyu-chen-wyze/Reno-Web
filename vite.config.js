import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function () {
    var _a;
    return ({
        base: (_a = process.env.BASE_PATH) !== null && _a !== void 0 ? _a : "/",
        plugins: [react()]
    });
});
