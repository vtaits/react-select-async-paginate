import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../packages/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage'
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },

  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      resolve: {
        alias: {
          'select-async-paginate-model': path.join(__dirname, '../packages/select-async-paginate-model/src'),
          'select-async-paginate-fetch': path.join(__dirname, '../packages/select-async-paginate-fetch/src'),
          "select-async-paginate-vkui": path.join(__dirname, '../packages/select-async-paginate-vkui/src'),
          'use-select-async-paginate': path.join(__dirname, '../packages/use-select-async-paginate/src'),
          'use-select-async-paginate-fetch': path.join(__dirname, '../packages/use-select-async-paginate-fetch/src'),
          'react-select-async-paginate': path.join(__dirname, '../packages/react-select-async-paginate/src'),
          'react-select-fetch': path.join(__dirname, '../packages/react-select-fetch/src'),
        },
      },
    });
  },
};

export default config;
