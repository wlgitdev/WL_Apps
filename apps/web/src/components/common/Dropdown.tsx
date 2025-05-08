import { FC, ReactNode, useState, useRef, useEffect, createContext, useContext } from 'react';

// Create context for the close function
const DropdownContext = createContext<{ closeDropdown: () => void }>({ closeDropdown: () => { } });

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownItem: FC<DropdownItemProps> = ({
  children,
  onClick,
  className = ''
}) => {
  const { closeDropdown } = useContext(DropdownContext);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeDropdown();
  };

  return (
    <div
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${className}`}
      onClick={handleClick}
      role="menuitem"
    >
      {children}
    </div>
  );
};

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  menuClassName?: string;
}

export const Dropdown: FC<DropdownProps> = ({
  trigger,
  children,
  className = '',
  menuClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${menuClassName}`}
        >
          <DropdownContext.Provider value={{ closeDropdown }}>
            <div className="py-1" role="menu" aria-orientation="vertical">
              {children}
            </div>
          </DropdownContext.Provider>
        </div>
      )}
    </div>
  );
};