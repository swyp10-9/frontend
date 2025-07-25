import themeList from '@/constants/themeList';

export default function ThemeTag({ type }: { type: string }) {
  const theme = themeList.find(theme => theme.type === type);

  if (!theme) return null;

  return (
    <div
      className={`flex items-center justify-center rounded-sm w-[54px] h-[22px]`}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.color,
      }}
    >
      <p className={`text-sub-head-3`}>{theme.label}</p>
    </div>
  );
}
