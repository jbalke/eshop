import React, { useState, useContext, useCallback } from 'react';

const UIContext = React.createContext();

export const UIProvider = ({ children }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const value = React.useMemo(() => {
    return { setIsUserMenuOpen, isUserMenuOpen };
  }, [isUserMenuOpen]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUIContext = () => {
  const { isUserMenuOpen, setIsUserMenuOpen } = useContext(UIContext);

  const openUserMenu = useCallback(() => setIsUserMenuOpen(true), [
    setIsUserMenuOpen,
  ]);
  const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), [
    setIsUserMenuOpen,
  ]);
  const toggleUserMenu = useCallback(
    () => setIsUserMenuOpen((isOpen) => !isOpen),
    [setIsUserMenuOpen]
  );

  return {
    isUserMenuOpen,
    openUserMenu,
    closeUserMenu,
    toggleUserMenu,
  };
};
