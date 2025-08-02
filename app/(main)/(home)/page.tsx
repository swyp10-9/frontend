import MapPageClient from './_modules/map-page-client';

interface SearchParamsType {
  // selected: string;
  isNearBy: string;
  status: string;
  period: string;
  withWhom: string;
  theme: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const { status, period, withWhom, theme, isNearBy } = await searchParams;

  return (
    <MapPageClient
      initialParams={{ status, period, withWhom, theme, isNearBy }}
    />
  );
}
