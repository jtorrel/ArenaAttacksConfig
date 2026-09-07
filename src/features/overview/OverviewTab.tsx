import { useConfigStore } from '../../store/configStore'
import { BASE_STATS } from '../../types'

// ---- Helpers d'affichage -----------------------------------------------------

function pct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`
}

function sec(value: number): string {
  return `${value.toFixed(2)}s`
}

// ---- Sous-composants ---------------------------------------------------------

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-card)',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-base)',
        color: 'var(--ink)',
        marginBottom: 'var(--space-4)',
        paddingBottom: 'var(--space-3)',
        borderBottom: '1px solid var(--border-soft)',
        letterSpacing: '0.04em',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: 'var(--space-2) 0',
      borderBottom: '1px solid var(--border-soft)',
    }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>{value}</span>
        {sub && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>{sub}</span>}
      </span>
    </div>
  )
}

function BonusRow({ label, bonusA, labelA, bonusB, labelB }: {
  label: string
  bonusA: number; labelA: string
  bonusB: number; labelB: string
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-2) 0',
      borderBottom: '1px solid var(--border-soft)',
      gap: 'var(--space-4)',
    }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', minWidth: '80px' }}>{label}</span>
      <div style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', fontWeight: 600 }}>
          {labelA} <span style={{ color: 'var(--ink)' }}>{pct(bonusA)}</span>
        </span>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-alt)', fontWeight: 600 }}>
          {labelB} <span style={{ color: 'var(--ink)' }}>{pct(bonusB)}</span>
        </span>
      </div>
    </div>
  )
}

// ---- Composant principal -----------------------------------------------------

export function OverviewTab() {
  const equipment    = useConfigStore(s => s.config.equipment)
  const spells       = useConfigStore(s => s.config.spells)
  const getBonus     = useConfigStore(s => s.getEquipmentBonus)
  const getStats     = useConfigStore(s => s.getComputedStats)

  const bonus = getBonus()
  const stats = getStats()

  return (
    <div style={{
      padding: 'var(--space-8)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-6)',
      maxWidth: '900px',
      margin: '0 auto',
    }}>

      {/* ── Stats de base ── */}
      <Card title="Stats de base">
        <StatRow label="Dégâts"         value={`${BASE_STATS.degats}`}    sub="points" />
        <StatRow label="Vie"            value={`${BASE_STATS.vie}`}       sub="points" />
        <StatRow label="Défense"        value={pct(BASE_STATS.defense)}               />
        <StatRow label="Vitesse de cast" value={sec(BASE_STATS.vitesseCast)}          />
        <StatRow label="Cooldown"       value={sec(BASE_STATS.cooldown)}              />
      </Card>

      {/* ── Résumé équipement ── */}
      <Card title="Équipement">

        {/* Arme */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'var(--space-2) 0',
          borderBottom: '1px solid var(--border-soft)',
          marginBottom: 'var(--space-2)',
        }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>Arme</span>
          <span style={{
            fontSize: 'var(--text-sm)',
            color: equipment.weapon ? 'var(--ink)' : 'var(--muted)',
            fontStyle: equipment.weapon ? 'normal' : 'italic',
            fontWeight: equipment.weapon ? 600 : 400,
          }}>
            {equipment.weapon ?? 'aucune'}
          </span>
        </div>

        {/* Bonus par pièce */}
        <BonusRow
          label="Tête"
          bonusA={bonus.vitesseCast}   labelA="V.Cast"
          bonusB={bonus.cooldownSorts} labelB="CD Sorts"
        />
        <BonusRow
          label="Torse"
          bonusA={bonus.attaque}  labelA="ATQ"
          bonusB={bonus.defense}  labelB="DEF"
        />
        <BonusRow
          label="Bottes"
          bonusA={bonus.cooldownDash}  labelA="CD Dash"
          bonusB={bonus.vitesseCourse} labelB="Vitesse"
        />

        {/* Stats résultantes */}
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Résultat
          </p>
          <StatRow label="Dégâts"          value={`${stats.degatsDirects}`} sub="points" />
          <StatRow label="Défense"         value={pct(stats.defense)}                    />
          <StatRow label="Vitesse de cast" value={sec(stats.vitesseCast)}               />
          <StatRow label="Cooldown"        value={sec(stats.cooldown)}                  />
        </div>
      </Card>

      {/* ── Sorts ── */}
      <div style={{ gridColumn: '1 / -1' }}>
        <Card title="Sorts">
          {spells.length === 0 ? (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--muted)',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: 'var(--space-6) 0',
            }}>
              Aucun sort configuré
            </p>
          ) : (
            spells.map(spell => (
              <div key={spell.id} style={{
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--border-soft)',
                fontSize: 'var(--text-sm)',
                color: 'var(--ink)',
              }}>
                {spell.name}
              </div>
            ))
          )}
        </Card>
      </div>

    </div>
  )
}