import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: 'list',
	use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: 'pnpm dev --port 4173',
		url: 'http://localhost:4173',
		reuseExistingServer: false,
		env: {
			VITE_API_BASE_URL: 'http://localhost:4173/api',
			VITE_KAKAO_REST_API_KEY: 'test-key',
			VITE_KAKAO_REDIRECT_URI: 'http://localhost:4173/oauth/kakao',
		},
	},
})
