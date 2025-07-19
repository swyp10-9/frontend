import { SharedOptions, delay, http } from 'msw';
import { setupWorker } from 'msw/browser';

import { getHealthCheck } from './exampleApiMock';

// NOTE: mock service worker를 설정
export const initializeMSW = () => {
  const handlers = [globalDelay, ...getHealthCheck];
  const worker = setupWorker(...handlers);

  return worker.start({
    onUnhandledRequest: ignoreDevResources,
  });
};

// NOTE: 모든 핸들러에 자연스러운 서버 delay를 적용해요.
const globalDelay = http.all('*', async ({ request: req }) => {
  if (PATHS_IGNORED_BY_MSW.find(path => req.url.includes(path))) {
    return;
  }

  await delay();
});

const PATHS_IGNORED_BY_MSW = [
  '/src',
  '/virtual',
  '/.storybook',
  '.vite',
  '.json',
  'favicon',
  'fonts',
];

type OnUnHandledRequest = SharedOptions['onUnhandledRequest'];

export const ignoreDevResources: OnUnHandledRequest = (req, print) => {
  if (PATHS_IGNORED_BY_MSW.find(path => req.url.includes(path))) {
    return;
  }

  print.warning();
};
