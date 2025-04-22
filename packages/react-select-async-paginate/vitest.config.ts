import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		browser: {
			provider: "playwright",
			enabled: true,
			instances: [{ browser: "chromium" }],
			viewport: {
				width: 600,
				height: 300,
			}
		},
	},
});
