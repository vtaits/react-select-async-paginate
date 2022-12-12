module.exports = {
  stories: ['../packages/**/*.stories.mdx'],

  framework: '@storybook/react',

  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-controls',
    '@storybook/addon-docs',
  ],

  core: {
    builder: '@storybook/builder-vite',
  },

  features: {
    previewMdx2: true,
    storyStoreV7: true,
  },
};
