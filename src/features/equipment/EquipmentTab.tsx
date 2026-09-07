import { useState } from 'react';
import { Slider } from '../../components/slider/Slider';

export function EquipmentTab() {
  const [defense, setDefense]   = useState(50);
  const [radius, setRadius]     = useState(30);
  const [castTime, setCastTime] = useState(80);

  return (
    <div style={{
      padding: 'var(--space-8)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)',
      maxWidth: '480px',
    }}>

      <p style={{ fontFamily: 'var(--font-display)', color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
        Bac à sable — Slider
      </p>

      {/* Cas 1 : défaut, 0-100, pas d'unité */}
      <Slider
        label="Défense"
        value={defense}
        onChange={setDefense}
        status="default"
      />

      {/* Cas 2 : displayMin/Max + unité */}
      <Slider
        label="Rayon"
        value={radius}
        onChange={setRadius}
        unit="m"
        displayMin={0}
        displayMax={50}
        status="valid"
      />

      {/* Cas 3 : unité + statut invalide */}
      <Slider
        label="Temps de cast"
        value={castTime}
        onChange={setCastTime}
        unit="s"
        displayMin={0}
        displayMax={10}
        status="invalid"
      />

    </div>
  );
}