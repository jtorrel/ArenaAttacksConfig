import './Slider.css';

// ---- Types -------------------------------------------------------

export type SliderStatus = 'default' | 'valid' | 'invalid';

export interface SliderProps {
  label: string;
  value: number;           // toujours 0-100
  onChange: (value: number) => void;
  unit?: string;           // suffixe affiché ex: "m", "s", "%"
  displayMin?: number;     // valeur affichée pour 0   (défaut: 0)
  displayMax?: number;     // valeur affichée pour 100 (défaut: 100)
  status?: SliderStatus;   // défaut: 'default'
  id?: string;             // pour l'accessibilité
}

// ---- Helpers -----------------------------------------------------

/**
 * Convertit la valeur interne (0-100) en valeur d'affichage.
 * Interpolation linéaire entre displayMin et displayMax.
 */
function toDisplay(value: number, displayMin: number, displayMax: number): number {
  const raw = displayMin + (value / 100) * (displayMax - displayMin);
  return Math.round(raw);
}

// ---- Composant ---------------------------------------------------

export function Slider({
  label,
  value,
  onChange,
  unit,
  displayMin = 0,
  displayMax = 100,
  status = 'default',
  id,
}: SliderProps) {
  const sliderId = id ?? `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const displayed = toDisplay(value, displayMin, displayMax);
  const displayedMin = Math.round(displayMin);
  const displayedMax = Math.round(displayMax);

  return (
    <div
      className={`slider-root slider-root--${status}`}
      // CSS custom property utilisée dans la piste pour colorier la partie remplie
      style={{ '--slider-pct': `${value}%` } as React.CSSProperties}
    >
      {/* Label + valeur courante */}
      <div className="slider-header">
        <label className="slider-label" htmlFor={sliderId}>
          {label}
        </label>
        <span className="slider-value">
          {displayed}{unit ? `\u00a0${unit}` : ''}
        </span>
      </div>

      {/* Borne min — piste — borne max */}
      <div className="slider-track-row">
        <span className="slider-bound">{displayedMin}{unit ? `\u00a0${unit}` : ''}</span>

        <input
          id={sliderId}
          className="slider-input"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />

        <span className="slider-bound">{displayedMax}{unit ? `\u00a0${unit}` : ''}</span>
      </div>
    </div>
  );
}