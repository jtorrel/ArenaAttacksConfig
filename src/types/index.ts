// ============================================================
//  TYPES CENTRAUX — ArenaAttacksConfig
// ============================================================

// ------------------------------------------------------------
// 1. STATS DE BASE
//    Définies par le jeu, immuables depuis la config joueur
// ------------------------------------------------------------

export interface BaseStats {
  vitesseCast:    number   // secondes  (ex: 1.5)
  cooldown:       number   // secondes  (ex: 0.5)
  degats:         number   // points    (ex: 100)
  vie:            number   // points    (ex: 1000)
  defense:        number   // ratio 0-1 (ex: 0 = 0%)
}

export const BASE_STATS: BaseStats = {
  vitesseCast: 1.5,
  cooldown:    0.5,
  degats:      100,
  vie:         1000,
  defense:     0,
}

// ------------------------------------------------------------
// 2. ÉQUIPEMENT
// ------------------------------------------------------------

// Les clés de stats affectées par l'équipement
export type StatKey =
  | 'vitesseCast'      // tête   — stat A
  | 'cooldownSorts'    // tête   — stat B
  | 'attaque'          // torse  — stat A
  | 'defense'          // torse  — stat B
  | 'cooldownDash'     // bottes — stat A
  | 'vitesseCourse'    // bottes — stat B

// Une pièce d'équipement avec slider de répartition
// value 0   → 100% du budget sur statA, 0% sur statB
// value 100 → 0% du budget sur statA, 100% sur statB
export interface StatPiece {
  value:       number    // slider 0-100
  budgetTotal: number    // toujours 50 (%)
  statA:       StatKey
  statB:       StatKey
}

// Les 4 emplacements
export type WeaponId = string   // identifiant de l'arme choisie

export interface Equipment {
  head:   StatPiece
  chest:  StatPiece
  boots:  StatPiece
  weapon: WeaponId | null
}

export const DEFAULT_EQUIPMENT: Equipment = {
  head: {
    value: 50, budgetTotal: 50,
    statA: 'vitesseCast',
    statB: 'cooldownSorts',
  },
  chest: {
    value: 50, budgetTotal: 50,
    statA: 'attaque',
    statB: 'defense',
  },
  boots: {
    value: 50, budgetTotal: 50,
    statA: 'cooldownDash',
    statB: 'vitesseCourse',
  },
  weapon: null,
}

// ------------------------------------------------------------
// 3. SORTS
// ------------------------------------------------------------

// Forme : zone d'effet géométrique
export interface SpellShape {
  distance: number   // 0-100 → distance du centre par rapport au personnage
  radius:   number   // 0-100 → taille de la zone
  angle:    number   // 0-100 → 100 = disque complet, 50 = demi, 25 = quart...
}

// Type de sort (ex: feu, glace, foudre...)
// Le slider déplace l'effet du type :
//   value 0   → plein dégâts directs, dot minimal
//   value 100 → 0 dégâts directs, dot maximal
export interface SpellType {
  id:    string
  value: number   // 0-100
}

// Un modifier individuel
// La liste est valide si la moyenne de tous les values = 50
export interface SpellModifier {
  id:    string
  value: number   // 0-100
}

// Un sort complet
export interface Spell {
  id:        string
  name:      string
  shape:     SpellShape
  type:      SpellType
  modifiers: SpellModifier[]
}

// Statut de validité d'un sort (règle d'équilibre des modifiers)
export type SpellValidity = 'valid' | 'invalid' | 'empty'  // empty = pas de modifier

// ------------------------------------------------------------
// 4. STATS CALCULÉES
//    Résultat de base + équipement + sort actif
// ------------------------------------------------------------

// Bonus apportés par l'équipement (en %, ratio 0-1)
export interface EquipmentBonus {
  vitesseCast:   number   // réduction du temps de cast
  cooldownSorts: number   // réduction du cooldown des sorts
  attaque:       number   // bonus de dégâts
  defense:       number   // réduction des dégâts reçus
  cooldownDash:  number   // réduction du cooldown du dash
  vitesseCourse: number   // bonus de vitesse
}

// Stats finales après tous les modificateurs
export interface ComputedStats {
  // Depuis la base
  vitesseCast:    number   // secondes effectives
  cooldown:       number   // secondes effectives
  vie:            number   // points

  // Depuis équipement + sorts
  degatsDirects:  number   // points de dégâts immédiats
  degatsDot:      number   // points de dégâts sur la durée
  defense:        number   // ratio 0-1 effectif
  attaque:        number   // ratio bonus dégâts 0-1
  cooldownDash:   number   // secondes effectives
  vitesseCourse:  number   // ratio 0-1 bonus vitesse
}

// ------------------------------------------------------------
// 5. CONFIG COMPLÈTE (racine du store)
// ------------------------------------------------------------

export interface Config {
  base:      BaseStats
  equipment: Equipment
  spells:    Spell[]
}

export const DEFAULT_CONFIG: Config = {
  base:      BASE_STATS,
  equipment: DEFAULT_EQUIPMENT,
  spells:    [],
}