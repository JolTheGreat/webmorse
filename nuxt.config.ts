// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},

    hooks: {
        'pages:extend'(pages) {
            pages.push({
                'name': 'console',
                'path': '/',
                file: '~/pages/Console.vue'
            })
        }
    },


})
