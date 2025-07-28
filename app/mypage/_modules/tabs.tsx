import { ReactNode, createContext, useContext, useState } from 'react';

interface TabsContextType {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function UiTabs({
  children,
  defaultValue,
  value,
  onValueChange,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const selectedValue = value !== undefined ? value : internalValue;
  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      value={{ selectedValue, onValueChange: handleValueChange }}
    >
      <div className='relative flex w-full items-center'>
        <div className='flex w-full'>{children}</div>
        <div className='absolute right-0 bottom-0 left-0 h-px bg-gray-200'></div>
      </div>
    </TabsContext.Provider>
  );
}

interface TabProps {
  label: string;
  value: string;
  onClick?: () => void;
}

export function UiTab({ label, value, onClick }: TabProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('UiTab must be used within UiTabs');
  }

  const { selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  const handleClick = () => {
    onValueChange(value);
    onClick?.();
  };

  return (
    <div
      className='relative flex flex-1 cursor-pointer items-center justify-center py-3'
      onClick={handleClick}
    >
      <p
        className={`ui-text-body-2 ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}
      >
        {label}
      </p>
      {isSelected && (
        <div className='absolute right-0 bottom-0 left-0 h-0.5 bg-gray-900'></div>
      )}
    </div>
  );
}
