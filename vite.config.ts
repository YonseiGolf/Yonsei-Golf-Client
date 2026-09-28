import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	// Only these three public Vue variables are exposed during the migration.
	const aliases = {
		VITE_API_BASE_URL: env.VITE_API_BASE_URL ?? env.VUE_APP_API_URL ?? '',
		VITE_KAKAO_REST_API_KEY: env.VITE_KAKAO_REST_API_KEY ?? env.VUE_APP_KAKAO_REST_API_KEY ?? '',
		VITE_KAKAO_REDIRECT_URI: env.VITE_KAKAO_REDIRECT_URI ?? env.VUE_APP_KAKAO_REDIRECT_URI ?? '',
	}
	return {
		plugins: [tailwindcss(), react()],
		resolve: { alias: { '@': '/src' } },
		define: Object.fromEntries(
			Object.entries(aliases).map(([key, value]) => [
				`import.meta.env.${key}`,
				JSON.stringify(value),
			]),
		),
		server: { host: 'localhost', port: 3000, strictPort: true },
	}
})
