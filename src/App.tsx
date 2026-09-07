import { useState } from 'react';
import { Tabs, TabConfig } from './components/Tabs/Tabs';
import { EquipmentTab } from './features/equipment/EquipmentTab';
import { SpellbookTab } from './features/spellbook/SpellbookTab';
import { OverviewTab } from './features/overview/OverviewTab';

const TABS: TabConfig[] = [
  {
    id: 'equipment',
    label: 'Équipement',
    icon: '⚔️',
    content: <EquipmentTab />,
  },
  {
    id: 'spellbook',
    label: 'Grimoire',
    icon: '✦',
    content: <SpellbookTab />,
  },
  {
    id: 'overview',
    label: 'Vue d\'ensemble',
    icon: '◈',
    content: <OverviewTab />,
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('equipment');

  return (
    <Tabs
      tabs={TABS}
      activeId={activeTab}
      onChange={setActiveTab}
    />
  );
}