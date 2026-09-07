import { useState } from 'react'
import { Slider } from '../../components/Slider/Slider'
import { useConfigStore } from '../../store/configStore'

// ---- Armes disponibles (à déplacer dans un fichier de données plus tard) ----

const WEAPONS = ['Épée longue', 'Dague', 'Bâton de mage', 'Arc', 'Marteau de guerre']

// ---- Panneau stat (tête / torse / bottes) ------------------------------------

function StatSlotPanel({
  label, statA, statB, value, onChange,
}: {
  label: string
  statA: string
  statB: string
  value: number
  onChange: (v: number) => void
}) {
  const pctA = 100 - value
  const pctB = value

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-raised)', width: '220px',
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--ink)', marginBottom: 'var(--space-3)' }}>
        {label}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>{statA}</span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>{pctA}%</span>
      </div>
      <Slider label="" value={value} onChange={onChange} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>{pctB}%</span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>{statB}</span>
      </div>
    </div>
  )
}

// ---- Panneau arme ------------------------------------------------------------

function WeaponPanel({ selected, onChange }: { selected: string | null; onChange: (w: string) => void }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-raised)', width: '200px',
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--ink)', marginBottom: 'var(--space-3)' }}>
        Choisir une arme
      </p>
      {WEAPONS.map(w => (
        <div key={w} onClick={() => onChange(w)} style={{
          padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', fontSize: 'var(--text-sm)',
          color: selected === w ? 'var(--accent)' : 'var(--ink)',
          background: selected === w ? 'rgba(91,126,95,0.1)' : 'transparent',
          fontWeight: selected === w ? 600 : 400,
        }}>
          {w}
        </div>
      ))}
    </div>
  )
}

// ---- Slot SVG cliquable ------------------------------------------------------

function SlotBox({ x, y, w, h, title, line1, line2, isEmpty, onClick, isActive }: {
  x: number; y: number; w: number; h: number
  title: string; line1: string; line2?: string; isEmpty?: boolean
  onClick: () => void; isActive: boolean
}) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={isActive ? '#EDE5D8' : '#F7F3EC'}
        stroke={isActive ? '#A89868' : '#C4B49A'}
        strokeWidth={isActive ? 1.5 : 1}
      />
      <text x={x + w / 2} y={y + 20} textAnchor="middle"
        style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '13px', fill: '#2C2416', fontWeight: 600 }}>
        {title}
      </text>
      <text x={x + w / 2} y={y + 38} textAnchor="middle"
        style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', fill: isEmpty ? '#B0A080' : '#8C7B60', fontStyle: isEmpty ? 'italic' : 'normal' }}>
        {line1}
      </text>
      {line2 && (
        <text x={x + w / 2} y={y + 52} textAnchor="middle"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', fill: '#8C7B60' }}>
          {line2}
        </text>
      )}
    </g>
  )
}

// ---- Silhouette --------------------------------------------------------------

function ArmorSilhouette() {
  return (
    <g>
      <style>{`
        .ar { fill: #D8CEBB; stroke: #A89878; stroke-width: 0.8; }
        .ar-dk { fill: #C4B4A0; stroke: #A89878; stroke-width: 0.8; }
        .ar-d { fill: none; stroke: #A89878; stroke-width: 0.6; opacity: 0.65; }
      `}</style>
      <path d="M318 52 L318 44 L322 38 L340 34 L358 38 L362 44 L362 52 L364 72 L362 88 L355 96 L340 100 L325 96 L318 88 L316 72 Z" className="ar"/>
      <path d="M326 68 L354 68 L354 78 L326 78 Z" className="ar-dk"/>
      <path d="M328 70 L352 70 M328 76 L352 76" className="ar-d"/>
      <path d="M334 36 L340 24 L346 36" className="ar-d"/>
      <path d="M316 60 L309 58 L307 78 L318 82" className="ar-dk"/>
      <path d="M364 60 L371 58 L373 78 L362 82" className="ar-dk"/>
      <path d="M332 98 L332 112 L348 112 L348 98" className="ar"/>
      <path d="M335 100 L335 110 M339 100 L339 110 M343 100 L343 110 M347 100 L347 110" className="ar-d"/>
      <path d="M286 118 L306 112 L312 130 L306 142 L284 146 L276 139 L276 126 Z" className="ar"/>
      <path d="M280 127 L304 121 M278 136 L304 129" className="ar-d"/>
      <path d="M394 118 L374 112 L368 130 L374 142 L396 146 L404 139 L404 126 Z" className="ar"/>
      <path d="M400 127 L376 121 M402 136 L376 129" className="ar-d"/>
      <path d="M308 112 L372 112 L379 150 L381 202 L340 210 L299 202 L301 150 Z" className="ar"/>
      <line x1="340" y1="112" x2="340" y2="210" className="ar-d"/>
      <path d="M306 132 L340 138 L374 132" className="ar-d"/>
      <path d="M303 155 L340 161 L377 155" className="ar-d"/>
      <path d="M302 178 L340 184 L378 178" className="ar-d"/>
      <path d="M301 198 L340 204 L379 198" className="ar-d"/>
      <path d="M308 112 L301 202 M372 112 L379 202" className="ar-d"/>
      <path d="M284 146 L276 150 L270 198 L283 202 L295 198 L300 152" className="ar"/>
      <path d="M272 170 L292 174 M271 186 L291 190" className="ar-d"/>
      <path d="M270 198 L266 212 L283 218 L295 212 L293 198" className="ar-dk"/>
      <path d="M268 205 L292 209" className="ar-d"/>
      <path d="M268 214 L263 258 L277 263 L289 258 L291 214" className="ar"/>
      <path d="M265 233 L288 237 M264 248 L287 252" className="ar-d"/>
      <path d="M263 260 L263 274 L269 281 L281 281 L287 274 L289 260" className="ar-dk"/>
      <path d="M264 274 L265 284 L270 286 L270 274" className="ar"/>
      <path d="M271 275 L272 288 L277 289 L277 275" className="ar"/>
      <path d="M278 275 L279 288 L283 287 L283 275" className="ar"/>
      <path d="M284 274 L284 283 L288 281 L288 274" className="ar"/>
      <path d="M264 274 L288 274 M265 278 L287 278" className="ar-d"/>
      <path d="M396 146 L404 150 L410 198 L397 202 L385 198 L380 152" className="ar"/>
      <path d="M408 170 L388 174 M409 186 L389 190" className="ar-d"/>
      <path d="M410 198 L414 212 L397 218 L385 212 L387 198" className="ar-dk"/>
      <path d="M412 205 L388 209" className="ar-d"/>
      <path d="M412 214 L417 258 L403 263 L391 258 L389 214" className="ar"/>
      <path d="M415 233 L392 237 M416 248 L393 252" className="ar-d"/>
      <path d="M417 260 L417 274 L411 281 L399 281 L393 274 L391 260" className="ar-dk"/>
      <path d="M416 274 L415 284 L410 286 L410 274" className="ar"/>
      <path d="M409 275 L408 288 L403 289 L403 275" className="ar"/>
      <path d="M402 275 L401 288 L397 287 L397 275" className="ar"/>
      <path d="M396 274 L396 283 L392 281 L392 274" className="ar"/>
      <path d="M416 274 L392 274 M415 278 L393 278" className="ar-d"/>
      <path d="M301 202 L379 202 L383 218 L297 218 Z" className="ar-dk"/>
      <path d="M301 218 L297 242 L312 242 L314 218" className="ar"/>
      <path d="M314 218 L312 242 L329 242 L329 218" className="ar"/>
      <path d="M329 218 L329 242 L351 242 L351 218" className="ar"/>
      <path d="M351 218 L351 242 L368 242 L366 218" className="ar"/>
      <path d="M366 218 L368 242 L383 242 L379 218" className="ar"/>
      <path d="M301 210 L379 210" className="ar-d"/>
      <path d="M303 240 L317 240 L319 320 L301 320 Z" className="ar"/>
      <path d="M305 262 L317 262 M304 282 L317 282 M304 302 L317 302" className="ar-d"/>
      <path d="M363 240 L377 240 L379 320 L361 320 Z" className="ar"/>
      <path d="M363 262 L375 262 M363 282 L376 282 M363 302 L376 302" className="ar-d"/>
      <path d="M299 318 L321 318 L323 336 L299 336 Z" className="ar-dk"/>
      <path d="M301 324 L321 324 M301 330 L321 330" className="ar-d"/>
      <path d="M359 318 L381 318 L381 336 L357 336 Z" className="ar-dk"/>
      <path d="M359 324 L379 324 M359 330 L379 330" className="ar-d"/>
      <path d="M301 334 L321 334 L319 406 L303 406 Z" className="ar"/>
      <path d="M304 354 L319 354 M304 373 L319 373 M304 392 L319 392" className="ar-d"/>
      <path d="M359 334 L381 334 L379 406 L361 406 Z" className="ar"/>
      <path d="M361 354 L379 354 M361 373 L379 373 M361 392 L379 392" className="ar-d"/>
      <path d="M299 404 L321 404 L323 432 L294 436 L290 420 L297 412 Z" className="ar-dk"/>
      <path d="M292 418 L321 418 M290 436 L323 432" className="ar-d"/>
      <path d="M359 404 L381 404 L383 412 L390 420 L386 436 L357 432 L357 404 Z" className="ar-dk"/>
      <path d="M359 418 L388 418 M357 432 L390 436" className="ar-d"/>
    </g>
  )
}

// ---- Composant principal -----------------------------------------------------

export function EquipmentTab() {
  const [activeSlot, setActiveSlot] = useState<string | null>(null)

  // Lecture du store
  const equipment        = useConfigStore(s => s.config.equipment)
  const setEquipmentSlider = useConfigStore(s => s.setEquipmentSlider)
  const setWeapon        = useConfigStore(s => s.setWeapon)

  const toggle = (id: string) => setActiveSlot(prev => prev === id ? null : id)

  const panelPositions: Record<string, React.CSSProperties> = {
    head:   { top: '30px',  left: '50%', transform: 'translateX(-50%)' },
    chest:  { top: '140px', right: '16px' },
    boots:  { top: '380px', right: '16px' },
    weapon: { top: '240px', left: '16px' },
  }

  return (
    <div style={{ position: 'relative', padding: 'var(--space-6)', display: 'flex', justifyContent: 'center' }}>

      {/* Panneau flottant actif */}
      {activeSlot && (
        <div style={{ position: 'absolute', ...panelPositions[activeSlot], zIndex: 20 }}>
          {activeSlot === 'weapon' ? (
            <WeaponPanel
              selected={equipment.weapon}
              onChange={(w) => { setWeapon(w); setActiveSlot(null) }}
            />
          ) : activeSlot === 'head' ? (
            <StatSlotPanel
              label="Tête" statA="Vitesse de cast" statB="Cooldown des sorts"
              value={equipment.head.value}
              onChange={(v) => setEquipmentSlider('head', v)}
            />
          ) : activeSlot === 'chest' ? (
            <StatSlotPanel
              label="Torse" statA="Attaque" statB="Défense"
              value={equipment.chest.value}
              onChange={(v) => setEquipmentSlider('chest', v)}
            />
          ) : (
            <StatSlotPanel
              label="Bottes" statA="Cooldown du dash" statB="Vitesse de course"
              value={equipment.boots.value}
              onChange={(v) => setEquipmentSlider('boots', v)}
            />
          )}
        </div>
      )}

      {/* SVG principal */}
      <svg viewBox="0 0 680 480" style={{ width: '100%', maxWidth: '720px' }}
        onClick={(e) => { if (e.target === e.currentTarget) setActiveSlot(null) }}>

        <ArmorSilhouette />

        <path d="M244 66 Q280 66 308 66"    stroke="#C4B49A" strokeWidth="0.8" strokeDasharray="3 3" fill="none"/>
        <path d="M436 156 Q410 156 381 156"  stroke="#C4B49A" strokeWidth="0.8" strokeDasharray="3 3" fill="none"/>
        <path d="M436 406 Q414 406 383 420"  stroke="#C4B49A" strokeWidth="0.8" strokeDasharray="3 3" fill="none"/>
        <path d="M244 266 Q260 266 270 252"  stroke="#C4B49A" strokeWidth="0.8" strokeDasharray="3 3" fill="none"/>

        <SlotBox x={74}  y={30}  w={170} h={64} title="Tête"   isActive={activeSlot === 'head'}
          line1={`← ${100 - equipment.head.value}% vitesse de cast`}
          line2={`cooldown des sorts ${equipment.head.value}% →`}
          onClick={() => toggle('head')} />

        <SlotBox x={436} y={120} w={170} h={64} title="Torse"  isActive={activeSlot === 'chest'}
          line1={`← ${100 - equipment.chest.value}% attaque`}
          line2={`défense ${equipment.chest.value}% →`}
          onClick={() => toggle('chest')} />

        <SlotBox x={436} y={370} w={170} h={64} title="Bottes" isActive={activeSlot === 'boots'}
          line1={`← ${100 - equipment.boots.value}% dash`}
          line2={`vitesse ${equipment.boots.value}% →`}
          onClick={() => toggle('boots')} />

        <SlotBox x={74}  y={236} w={170} h={64} title="Arme"   isActive={activeSlot === 'weapon'}
          line1={equipment.weapon ?? 'emplacement vide'}
          line2={equipment.weapon ? undefined : 'cliquer pour choisir'}
          isEmpty={!equipment.weapon}
          onClick={() => toggle('weapon')} />

      </svg>
    </div>
  )
}