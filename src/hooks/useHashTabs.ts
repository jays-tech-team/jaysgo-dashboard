import { useCallback, useEffect, useState } from "react";
import { getCurrentHash, updateHashParams } from "../lib/utils";

interface UseHashTabsOptions {
  hashKey?: string;
  defaultValue?: string;
  onTabChange?: (value: string) => void;
}

export function useHashTabs({
  hashKey = "activeTab",
  defaultValue = "",
  onTabChange,
}: UseHashTabsOptions = {}) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const currentHash = getCurrentHash();
    return currentHash[hashKey] || defaultValue;
  });

  // Update active tab when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = getCurrentHash();
      const newActiveTab = currentHash[hashKey] || defaultValue;

      if (newActiveTab !== activeTab) {
        setActiveTab(newActiveTab);
        onTabChange?.(newActiveTab);
      }
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Initial check
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [hashKey, defaultValue, activeTab, onTabChange]);

  // Function to change active tab
  const changeTab = useCallback(
    (value: string) => {
      setActiveTab(value);
      updateHashParams({ [hashKey]: value });
      onTabChange?.(value);
    },
    [hashKey, onTabChange]
  );

  return {
    activeTab,
    changeTab,
    setActiveTab: changeTab,
  };
}
