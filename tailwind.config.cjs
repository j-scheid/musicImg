/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
            animation: {
                "scale-in-center": "scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both"
            },
            keyframes: {
                "scale-in-center": {
                    "0%": {
                        transform: "scale(0)",
                        opacity: "1"
                    },
                    to: {
                        transform: "scale(1)",
                        opacity: "1"
                    }
                }
            }
        },
	},
	plugins: [...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()],
}
