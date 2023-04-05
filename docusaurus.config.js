// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const GITHUB_USERNAME = 'icure'

async function createConfig() {
    const { remarkKroki } = await import('remark-kroki');
    const krokiConfig = {
        server: 'https://kroki.io/',
        alias: ['plantuml']
    }

    /** @type {import('@docusaurus/types').Config} */
    return {
        title: 'iCure Documentation',
        url: 'https://docs.icure.com',
        baseUrl: '/',
        onBrokenLinks: 'throw',
        onBrokenMarkdownLinks: 'warn',
        favicon: 'img/favicon.png',

        // GitHub pages deployment config.
        // If you aren't using GitHub pages, you don't need these.
        organizationName: GITHUB_USERNAME, // Usually your GitHub org/user name.
        projectName: 'medtech-docs', // Usually your repo name.

        // Even if you don't use internalization, you can use this field to set useful
        // metadata like html lang. For example, if your site is Chinese, you may want
        // to replace "en" with "zh-Hans".
        i18n: {
            defaultLocale: 'en',
            locales: ['en'],
        },

        plugins: [
            'content-pages',
            [
                'content-docs',
                {
                    id: 'default',
                    path: './sdks',
                    routeBasePath: 'sdks',
                    sidebarPath: require.resolve('./sidebarsSDK.js'),
                    editUrl:
                        `https://github.com/${GITHUB_USERNAME}/medtech-docs/edit/main/`,
                    remarkPlugins: [
                        [remarkKroki, krokiConfig]
                    ],
                },
            ],
            [
                'content-docs',
                {
                    id: 'cockpit',
                    path: './cockpit',
                    routeBasePath: 'cockpit',
                    sidebarPath: require.resolve('./sidebarsCockpit.js'),
                    editUrl:
                        `https://github.com/${GITHUB_USERNAME}/medtech-docs/edit/main/`,
                    remarkPlugins: [
                        [remarkKroki, krokiConfig]
                    ],
                },
            ],
            [
                '@docusaurus/plugin-sitemap',
                {
                    changefreq: 'weekly',
                    priority: 0.5,
                    ignorePatterns: ['/tags/**'],
                    filename: 'sitemap.xml',
                },
            ],
        ],

        themes: [
            [
                '@docusaurus/theme-classic',
                {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            ],
            '@docusaurus/theme-live-codeblock',
            '@docusaurus/theme-mermaid',
            '@docusaurus/theme-search-algolia'
        ],

        markdown: {
            mermaid: true
        },

        themeConfig:
            /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
            ({
                colorMode: {
                    defaultMode: 'dark',
                },
                navbar: {
                    // title: 'iCure MedTech Docs',
                    logo: {
                        alt: 'iCure Logo',
                        src: 'img/logo.svg',
                        srcDark: 'img/logo-dark.svg',
                        className: 'logoBtn'
                    },
                    items: [
                        {
                            type: 'doc',
                            docId: 'intro',
                            position: 'right',
                            label: 'Medical Device SDK',
                        },
                        {
                            type: 'doc',
                            docId: 'intro',
                            position: 'right',
                            label: 'Cockpit',
                            docsPluginId: 'cockpit',
                        },
                        {
                            type: 'search',
                            position: 'right',
                        },
                        {
                            position: 'right',
                            type: 'html',
                            className: 'gitHubBtn',
                            value: `<a href="https://github.com/orgs/${GITHUB_USERNAME}/repositories?q=medical-device&type=all&language=&sort=" target='_'>
                                <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_74_199)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13 0.135864C20.1799 0.135864 26 6.10277 26 13.4647C26 19.3524 22.2794 24.347 17.1171 26.1111C16.458 26.2424 16.224 25.8262 16.224 25.4713C16.224 25.0319 16.2396 23.5967 16.2396 21.8131C16.2396 20.5703 15.8236 19.7592 15.3569 19.3458C18.252 19.0156 21.294 17.8884 21.294 12.769C21.294 11.313 20.7896 10.1248 19.955 9.19143C20.0902 8.85473 20.5361 7.499 19.8276 5.6634C19.8276 5.6634 18.7382 5.30625 16.2565 7.03005C15.2178 6.73495 14.105 6.58648 13 6.58128C11.895 6.58648 10.7835 6.73495 9.7461 7.03005C7.2618 5.30625 6.1698 5.6634 6.1698 5.6634C5.4639 7.499 5.9098 8.85473 6.0437 9.19143C5.213 10.1248 4.7047 11.313 4.7047 12.769C4.7047 17.8754 7.7402 19.0199 10.6275 19.3566C10.2557 19.6894 9.919 20.2765 9.802 21.1384C9.061 21.479 7.1786 22.0684 6.019 20.0313C6.019 20.0313 5.3313 18.7507 4.0261 18.6571C4.0261 18.6571 2.7586 18.6402 3.9377 19.467C3.9377 19.467 4.7892 19.8765 5.3807 21.417C5.3807 21.417 6.1438 23.796 9.7604 22.99C9.7669 24.1041 9.7786 25.1541 9.7786 25.4713C9.7786 25.8236 9.5394 26.2359 8.8907 26.1124C3.7245 24.3509 0 19.3537 0 13.4647C0 6.10277 5.8214 0.135864 13 0.135864Z" fill="#08928F"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_74_199">
                                    <rect width="26" height="26" fill="white" transform="translate(0 0.135864)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                <span>GitHub</span>
                            </a>`,
                        },
                    ],

                },
                // To modify Footer, please go to the src/theme/Footer/Layout/index.js file
                // ================================================
                footer: {
                },
                prism: {
                    theme: lightCodeTheme,
                    darkTheme: darkCodeTheme,
                },
                algolia: {
                    // The application ID provided by Algolia
                    appId: 'BYJ2KXMHNU',
                    // Public API key: it is safe to commit it
                    apiKey: '12d8dbe268fc8f0d7186480441051663',
                    indexName: 'icure',
                    contextualSearch: true,
                    searchParameters: {},
                    searchPagePath: 'search',
                    // className: 'search'
                },
            }),
    }
}

module.exports = createConfig;
