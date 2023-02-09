import { defineUserConfig, defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
    // 在这里进行配置
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'zh-CN',
            title: 'Parabox',
            description: 'Parabox 用户文档及开发文档。',
            selectLanguageName: '简体中文',
        },
        '/en/': {
            lang: 'en-US',
            title: 'Parabox',
            description: 'User documentation and development documentation of Parabox.',
            selectLanguageName: 'English',
        },
    },
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.png' }]
    ],
    theme: defaultTheme({
        // 默认主题配置
        locales: {
            '/': {
                selectLanguageName: '简体中文',
                navbar: [{
                        text: '欢迎',
                        children: [{
                                text: '欢迎',
                                link: '/',
                            },
                            {
                                text: '如何工作',
                                link: '/how-it-works/',
                            },
                            {
                                text: '用户协议',
                                link: '/terms/',
                            },
                            {
                                text: '隐私政策',
                                link: '/privacy/',
                            }
                        ],
                    }, {
                        text: '快速上手',
                        link: '/quick-start/',
                    },
                    {
                        text: '常见问题',
                        link: '/faq/',
                    },
                    {
                        text: '开发文档',
                        children: [{
                                text: '开发文档',
                                link: '/developer/',
                            },
                            {
                                text: 'SDK 文档',
                                link: '/parabox-development-kit/',
                            }
                        ]
                    }
                ]
            },
            '/en/': {
                selectLanguageName: 'English',
                navbar: [{
                        text: 'Welcome',
                        children: [{
                                text: 'Welcome',
                                link: '/en/',
                            },
                            {
                                text: 'How it works',
                                link: '/en/how-it-works/',
                            },
                            {
                                text: 'Terms of Service',
                                link: '/en/terms/',
                            },
                            {
                                text: 'Privacy Policy',
                                link: '/en/privacy/',
                            }
                        ],
                    }, {
                        text: 'Quick Start',
                        link: '/en/quick-start/',
                    },
                    {
                        text: 'FAQ',
                        link: '/en/faq/',
                    },
                    {
                        text: 'Developer Docs',
                        children: [{
                                text: 'Developer Docs',
                                link: '/en/developer/',
                            },
                            {
                                text: 'SDK Docs',
                                link: '/en/parabox-development-kit/',
                            }
                        ]
                    }
                ]
            },
        },
        logo: '/images/app.png',
        repo: 'Parabox-App/parabox',
        editLink: false,
        // docsRepo: 'https://github.com/Parabox-App/parabox-docs',
        // docsBranch: 'vue-press',
    }),
    plugins: [
        searchPlugin({
            locales: {
                '/': {
                    placeholder: '搜索',
                },
                '/en/': {
                    placeholder: 'Search',
                },
            },
        }),
    ],
})