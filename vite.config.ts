import {defineConfig} from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import {tweets} from './plugins/tweets.ts'

const siteUrl = (
    process.env.VITE_SITE_URL?.replace(/\/$/, '') || 'https://www.quantapar.com'
)

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        tweets(),
        {
            name: 'html-meta',
            transformIndexHtml(html) {
                const ogImage = siteUrl ? `${siteUrl}/og-image.png` : '/og-image.png'

                if (siteUrl) {
                    return html
                        .replaceAll('__SITE_URL__', siteUrl)
                        .replaceAll('__OG_IMAGE__', ogImage)
                }

                return html
                    .replace('    <meta property="og:url" content="__SITE_URL__" />\n', '')
                    .replaceAll('__OG_IMAGE__', ogImage)
            },
        },
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
