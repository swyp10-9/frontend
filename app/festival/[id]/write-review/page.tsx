import { use } from 'react';

import WriteClient from './_modules/write-client';

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  console.log('resolvedParams:::', resolvedParams);

  return <WriteClient festivalId={Number(resolvedParams?.id)} />;
}
