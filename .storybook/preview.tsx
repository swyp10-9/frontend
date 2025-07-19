import React from 'react';

import type { Preview } from '@storybook/nextjs-vite';
import { initialize as initializeMSW, mswLoader } from 'msw-storybook-addon';

import { ReactQueryClientProvider } from '@/app/react-query-provider';
import { ignoreDevResources } from '@/mocks/api/initializeMSW';

initializeMSW({
  onUnhandledRequest: ignoreDevResources,
});

const preview: Preview = {
  decorators: [
    Story => (
      <ReactQueryClientProvider>
        <Story />
      </ReactQueryClientProvider>
    ),
  ],
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
