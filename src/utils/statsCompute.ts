// ============================================================
//  STATS COMPUTE — calcul pur, sans effet de bord
//  Entrée : Config  →  Sortie : ComputedStats
// ============================================================

import {
  BaseStats,
  Equipment,
  EquipmentBonus,
  ComputedStats,
  Spell,
  SpellValidity,
  StatPiece,
} from '../types'

// ------------------------------------------------------------
// 1. ÉQUIPEMENT
// ------------------------------------------------------------

/**
 * Convertit la valeur d'un slider (0-100) en bonus concrets pour statA et statB.
 * value 0   → budgetTotal% sur statA, 0% sur statB
 * value 100 → 0% sur statA, budgetTotal% sur statB
 */
function pieceBonus(piece: StatPiece): { bonusA: number; bonusB: number } {
  const ratio = piece.value / 100                          // 0 → 1
  const budget = piece.budgetTotal / 100                   // 50% → 0.5
  return {
    bonusA: budget * (1 - ratio),
    bonusB: budget * ratio,
  }
}

/**
 * Calcule l'ensemble des bonus apportés par l'équipement.
 * Chaque stat reçoit un ratio 0-1 (ex: 0.25 = +25%).
 */
export function computeEquipmentBonus(equipment: Equipment): EquipmentBonus {
  const head  = pieceBonus(equipment.head)
  const chest = pieceBonus(equipment.chest)
  const boots = pieceBonus(equipment.boots)

  return {
    vitesseCast:   head.bonusA,    // tête   statA
    cooldownSorts: head.bonusB,    // tête   statB
    attaque:       chest.bonusA,   // torse  statA
    defense:       chest.bonusB,   // torse  statB
    cooldownDash:  boots.bonusA,   // bottes statA
    vitesseCourse: boots.bonusB,   // bottes statB
  }
}

// ------------------------------------------------------------
// 2. SORTS — validité des modifiers
// ------------------------------------------------------------

/**
 * Un sort est valide si la moyenne de ses modifiers est exactement 50.
 * "empty" s'il n'a aucun modifier.
 *
 * On tolère ±1 pour les arrondis entiers (ex: 3 modifiers à 33/33/34).
 */
export function computeSpellValidity(spell: Spell): SpellValidity {
  if (spell.modifiers.length === 0) return 'empty'

  const sum     = spell.modifiers.reduce((acc, m) => acc + m.value, 0)
  const average = sum / spell.modifiers.length
  const isValid = Math.abs(average - 50) <= 1

  return isValid ? 'valid' : 'invalid'
}

// ------------------------------------------------------------
// 3. STATS FINALES
// ------------------------------------------------------------

/**
 * Calcule les stats complètes d'un personnage.
 * On passe le sort actif séparément (le joueur peut en changer).
 *
 * Formules :
 *   vitesseCast  = base × (1 - bonusVitesseCast)   // réduction du temps → plus bas = mieux
 *   cooldown     = base × (1 - bonusCooldown)
 *   dégâts directs = base × (1 + attaque) × facteurTypeDirects × facteurModifiers
 *   dégâts dot     = base × (1 + attaque) × facteurTypeDot     × facteurModifiers
 *   defense      = base + bonusDefense              // s'additionne (base = 0)
 */
export function computeStats(
  base:      BaseStats,
  equipment: Equipment,
  spell:     Spell | null,
): ComputedStats {
  const bonus = computeEquipmentBonus(equipment)

  // --- Temps et cooldowns ---
  const vitesseCast = base.vitesseCast * (1 - bonus.vitesseCast)
  const cooldown    = base.cooldown    * (1 - bonus.cooldownSorts)
  const cooldownDash = base.cooldown   * (1 - bonus.cooldownDash)

  // --- Défense ---
  const defense = base.defense + bonus.defense

  // --- Dégâts de base après équipement ---
  const degatsBase = base.degats * (1 + bonus.attaque)

  // --- Modificateurs du sort ---
  let degatsDirects = degatsBase
  let degatsDot     = 0

  if (spell) {
    // Facteur du type (ex: feu à value 100 → 0% directs, 150% dot)
    const typeRatio       = spell.type.value / 100          // 0 → 1
    const facteurDirects  = 1 - typeRatio                   // 1 → 0
    const facteurDot      = typeRatio * 1.5                 // 0 → 1.5

    // Facteur des modifiers : déviation par rapport à 50
    // Chaque modifier contribue proportionnellement à son écart à 50
    const modifierFactor = spell.modifiers.reduce((acc, m) => {
      const deviation = (m.value - 50) / 50                 // -1 → +1
      return acc + deviation
    }, 0)

    degatsDirects = degatsBase * facteurDirects * (1 + modifierFactor)
    degatsDot     = degatsBase * facteurDot     * (1 + modifierFactor)
  }

  return {
    vitesseCast,
    cooldown,
    vie:           base.vie,
    degatsDirects: Math.max(0, Math.round(degatsDirects)),
    degatsDot:     Math.max(0, Math.round(degatsDot)),
    defense,
    attaque:       bonus.attaque,
    cooldownDash,
    vitesseCourse: bonus.vitesseCourse,
  }
}