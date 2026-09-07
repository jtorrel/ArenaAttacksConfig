// ============================================================
//  TESTS MANUELS — statsCompute.ts
//  Lance ce fichier avec : npx tsx src/utils/statsCompute.test.ts
// ============================================================

import { computeEquipmentBonus, computeStats, computeSpellValidity } from './statsCompute'
import { BASE_STATS, DEFAULT_EQUIPMENT, Equipment, Spell } from '../types'

let passed = 0
let failed = 0

function assert(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ✓ ${label}`)
    passed++
  } else {
    console.error(`  ✗ ${label}`)
    failed++
  }
}

function roughly(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance
}

// ------------------------------------------------------------
console.log('\n── Équipement : slider à 50/50 ──')
// ------------------------------------------------------------
const bonus5050 = computeEquipmentBonus(DEFAULT_EQUIPMENT)
assert('attaque = 0.25',       roughly(bonus5050.attaque, 0.25))
assert('defense = 0.25',       roughly(bonus5050.defense, 0.25))
assert('vitesseCast = 0.25',   roughly(bonus5050.vitesseCast, 0.25))
assert('cooldownSorts = 0.25', roughly(bonus5050.cooldownSorts, 0.25))

// ------------------------------------------------------------
console.log('\n── Équipement : somme A+B = budget ──')
// ------------------------------------------------------------
assert('tête   A+B = 0.5', roughly(bonus5050.vitesseCast + bonus5050.cooldownSorts, 0.5))
assert('torse  A+B = 0.5', roughly(bonus5050.attaque + bonus5050.defense, 0.5))
assert('bottes A+B = 0.5', roughly(bonus5050.cooldownDash + bonus5050.vitesseCourse, 0.5))

// ------------------------------------------------------------
console.log('\n── Équipement : slider à 0 (tout sur statA) ──')
// ------------------------------------------------------------
const fullAttackEquip: Equipment = {
  ...DEFAULT_EQUIPMENT,
  chest: { ...DEFAULT_EQUIPMENT.chest, value: 0 },
}
const bonusFullA = computeEquipmentBonus(fullAttackEquip)
assert('attaque = 0.5',  roughly(bonusFullA.attaque, 0.5))
assert('defense = 0',    roughly(bonusFullA.defense, 0))

// ------------------------------------------------------------
console.log('\n── Équipement : 50/0 = 0/50 en puissance totale ──')
// ------------------------------------------------------------
const equip50_0: Equipment = {
  ...DEFAULT_EQUIPMENT,
  chest: { ...DEFAULT_EQUIPMENT.chest, value: 0 },   // tout attaque
}
const equip0_50: Equipment = {
  ...DEFAULT_EQUIPMENT,
  chest: { ...DEFAULT_EQUIPMENT.chest, value: 100 },  // tout défense
}
const b50_0 = computeEquipmentBonus(equip50_0)
const b0_50 = computeEquipmentBonus(equip0_50)
assert('budget total identique : 50/0 vs 0/50',
  roughly(b50_0.attaque + b50_0.defense, b0_50.attaque + b0_50.defense))

// ------------------------------------------------------------
console.log('\n── Stats finales sans sort ──')
// ------------------------------------------------------------
const stats = computeStats(BASE_STATS, DEFAULT_EQUIPMENT, null)
assert('vitesseCast < base (bonus)',  stats.vitesseCast < BASE_STATS.vitesseCast)
assert('dégâts directs = base (125)', stats.degatsDirects === 125)
assert('dégâts dot = 0',             stats.degatsDot === 0)
assert('vie inchangée',              stats.vie === BASE_STATS.vie)

// ------------------------------------------------------------
console.log('\n── Validité des modifiers ──')
// ------------------------------------------------------------
const spellBalanced: Spell = {
  id: 'test-1', name: 'Test', shape: { distance: 50, radius: 50, angle: 50 },
  type: { id: 'fire', value: 50 },
  modifiers: [
    { id: 'cast_time', value: 80 },
    { id: 'cooldown',  value: 20 },
  ],
}
const spellUnbalanced: Spell = {
  ...spellBalanced,
  modifiers: [
    { id: 'cast_time', value: 80 },
    { id: 'cooldown',  value: 80 },
  ],
}
const spellEmpty: Spell = { ...spellBalanced, modifiers: [] }

assert('sort équilibré → valid',   computeSpellValidity(spellBalanced)   === 'valid')
assert('sort déséquilibré → invalid', computeSpellValidity(spellUnbalanced) === 'invalid')
assert('sort sans modifier → empty',  computeSpellValidity(spellEmpty)       === 'empty')

// ------------------------------------------------------------
console.log(`\n── Résultat : ${passed} passés, ${failed} échoués ──\n`)
// ------------------------------------------------------------