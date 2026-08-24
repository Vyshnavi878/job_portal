import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

/**
 * Tabs component
 * Usage:
 *   <Tabs defaultTab="tab1">
 *     <TabsList>
 *       <Tab value="tab1">Tab 1</Tab>
 *       <Tab value="tab2" badge={5}>Tab 2</Tab>
 *     </TabsList>
 *     <TabPanel value="tab1">Content 1</TabPanel>
 *     <TabPanel value="tab2">Content 2</TabPanel>
 *   </Tabs>
 */

export function Tabs({ children, defaultTab, value: controlledValue, onChange, className = '' }) {
  const [internalTab, setInternalTab] = useState(defaultTab);
  const activeTab = controlledValue ?? internalTab;
  const setTab = (v) => {
    setInternalTab(v);
    onChange?.(v);
  };
  return (
    <TabsContext.Provider value={{ activeTab, setTab }}>
      <div className={`tabs ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={`tabs-list ${className}`} role="tablist">
      {children}
    </div>
  );
}

export function Tab({ value, children, badge, disabled = false }) {
  const { activeTab, setTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      className={`tab-trigger ${isActive ? 'active' : ''}`}
      onClick={() => !disabled && setTab(value)}
      disabled={disabled}
    >
      {children}
      {badge !== undefined && (
        <span className="tab-badge">{badge}</span>
      )}
    </button>
  );
}

export function TabPanel({ value, children, className = '' }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={`tabs-content ${className}`}
    >
      {children}
    </div>
  );
}
