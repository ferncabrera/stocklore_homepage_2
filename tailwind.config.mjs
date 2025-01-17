/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily: {
			roboto: ["Roboto"]
		},
		extend: {
			colors: {
				'stocklore-primary': '#6268FF',
				'stocklore-secondary': '#B9BCFF'
			}
		},
	},
	plugins: [],
}
