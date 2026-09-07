import { useState } from 'react';
import { Tabs, TabConfig } from './components/tabs/Tabs';
import { EquipmentTab } from './features/equipment/EquipmentTab';
import { SpellbookTab } from './features/spellbook/SpellbookTab';

// ---- Définition des onglets -------------------------------------


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
];

// ---- Composant racine -------------------------------------------

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