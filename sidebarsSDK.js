/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebarsSDK can be generated from the filesystem, or explicitly defined here.

 Create as many sidebarsSDK as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebarsSDK = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually

  sdkSidebar: [
    'intro',
    'quick-start',
    'release-notes',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial/index'],
    },
    {
      type: 'category',
      label: 'How To',
      link: {
        type: 'generated-index',
        title: 'How To',
        slug: '/how-to/index',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'how-to',
        },
      ],
    },
    {
      type: 'category',
      label: 'References',
      link: {
        type: 'doc',
        id: 'references/modules',
      },
      items: [
        {
          type: 'category',
          label: 'Classes',
          link: {
            type: 'generated-index',
            title: 'Classes',
            slug: '/references/classes',
          },
          items: [
            {
              type: 'autogenerated',
              dirName: 'references/classes',
            },
          ],
        },
        {
          type: 'category',
          label: 'Interfaces',
          link: {
            type: 'generated-index',
            title: 'Interfaces',
            slug: '/references/interfaces',
          },
          items: [
            {
              type: 'autogenerated',
              dirName: 'references/interfaces',
            },
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'Explanations',
      link: {
        type: 'doc',
        id: 'explanations',
      },
      // Can't use autogenerated items, but we may be able to do javascript code to retrieve them.
      items: [
        {
          type: 'category',
          label: 'What is the iCure Data Model?',
          link: {
            type: 'doc',
            id: 'explanations/data-model'
          },
          items: [
            'explanations/data-model/data-model-coding',
            'explanations/data-model/data-model-data-sample',
            'explanations/data-model/data-model-healthcare-element',
            'explanations/data-model/data-model-healthcare-professional',
            'explanations/data-model/data-model-medical-device',
            'explanations/data-model/data-model-notification',
            'explanations/data-model/data-model-patient',
            'explanations/data-model/data-model-user'
          ],
        },
        'explanations/encryption/introduction'
        /* TODO: when we make more encryption docs we need to replace explanations/encryption/introduction with this
         *  and update the introduction document to become again "introduction"
        {
          type: 'category',
          label: 'End-to-end encryption',
          link: {
            type: 'generated-index',
            title: 'End-to-end encryption',
            slug: '/explanations/encryption',
          },
          items: [
            'explanations/encryption/introduction'
          ],
        }
         */
      ],
    },
    'glossary'
  ],
};

module.exports = sidebarsSDK;
