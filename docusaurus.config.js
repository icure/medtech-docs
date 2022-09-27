// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const GITHUB_USERNAME = 'icure-io'

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'iCure MedTech Docs',
    tagline: 'Simplified Data Platform for EHR and MedTech',
    url: 'https://docs.icure.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.png',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'icure-io', // Usually your GitHub org/user name.
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
                    'https://github.com/icure-io/medtech-docs/edit/main/',
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
                    'https://github.com/icure-io/medtech-docs/edit/main/',
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
        '@docusaurus/theme-live-codeblock'
    ],

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
                    srcDark: 'img/logo-dark.svg'
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'intro',
                        position: 'left',
                        label: 'SDKs',
                    },
                    {
                        type: 'doc',
                        docId: 'intro',
                        position: 'left',
                        label: 'Cockpit',
                        docsPluginId: 'cockpit',
                    },
                    {
                        href: `https://github.com/orgs/${GITHUB_USERNAME}/repositories?q=medical-device&type=all&language=&sort=`,
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'SDKs',
                                to: '/sdks/intro',
                            },
                            {
                                label: 'Cockpit',
                                to: '/cockpit/intro',
                            },
                        ],
                    },
                    // {
                    //     title: 'Community',
                    //     items: [
                    //         {
                    //             label: 'Stack Overflow',
                    //             href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                    //         },
                    //         {
                    //             label: 'Discord',
                    //             href: 'https://discordapp.com/invite/docusaurus',
                    //         },
                    //         {
                    //             label: 'Twitter',
                    //             href: 'https://twitter.com/docusaurus',
                    //         },
                    //     ],
                    // },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'GitHub',
                                href: `https://github.com/${GITHUB_USERNAME}`,
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} iCure SA. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
