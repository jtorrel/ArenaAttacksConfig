import './Tabs.css';

// ---- Types -------------------------------------------------------

export interface TabConfig {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabConfig[];
  activeId: string;
  onChange: (id: string) => void;
}

// ---- Composant ---------------------------------------------------

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div className="tabs-root">

      {/* Barre d'onglets */}
      <div className="tabs-bar" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeId}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`tabs-tab${tab.id === activeId ? ' tabs-tab--active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && (
              <span className="tabs-tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panneau actif */}
      <div
        className="tabs-panel"
        role="tabpanel"
        id={`panel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
      >
        {activeTab?.content}
      </div>

    </div>
  );
}