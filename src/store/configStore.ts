// ============================================================
//  STORE — état global de la configuration
//  Zustand : léger, pas de boilerplate, slices par domaine
// ============================================================

import { create } from 'zustand'
import {
  Config,
  DEFAULT_CONFIG,
  Equipment,
  Spell,
  SpellModifier,
  SpellShape,
  SpellType,
  ComputedStats,
} from '../types'
import {
  computeStats,
  computeSpellValidity,
  computeEquipmentBonus,
} from '../utils/statsCompute'

// ------------------------------------------------------------
// Types des actions
// ------------------------------------------------------------

interface ConfigStore {
  // --- État ---
  config: Config

  // --- Équipement ---
  setEquipmentSlider: (slot: keyof Equipment, value: number) => void
  setWeapon:          (weaponId: string | null) => void

  // --- Sorts ---
  addSpell:           (spell: Spell) => void
  removeSpell:        (spellId: string) => void
  updateSpellShape:   (spellId: string, shape: Partial<SpellShape>) => void
  updateSpellType:    (spellId: string, type: Partial<SpellType>) => void
  updateModifier:     (spellId: string, modifierId: string, value: number) => void
  addModifier:        (spellId: string, modifier: SpellModifier) => void
  removeModifier:     (spellId: string, modifierId: string) => void

  // --- Sélecteurs calculés ---
  getComputedStats:   (spellId?: string) => ComputedStats
  getSpellValidity:   (spellId: string) => ReturnType<typeof computeSpellValidity>
  getEquipmentBonus:  () => ReturnType<typeof computeEquipmentBonus>
}

// ------------------------------------------------------------
// Helpers internes
// ------------------------------------------------------------

function updateSpell(spells: Spell[], spellId: string, updater: (s: Spell) => Spell): Spell[] {
  return spells.map(s => s.id === spellId ? updater(s) : s)
}

// ------------------------------------------------------------
// Store
// ------------------------------------------------------------

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: DEFAULT_CONFIG,

  // ── Équipement ────────────────────────────────────────────

  setEquipmentSlider: (slot, value) => {
    // 'weapon' n'a pas de slider — on ignore silencieusement
    if (slot === 'weapon') return

    set(state => ({
      config: {
        ...state.config,
        equipment: {
          ...state.config.equipment,
          [slot]: {
            ...state.config.equipment[slot],
            value,
          },
        },
      },
    }))
  },

  setWeapon: (weaponId) => {
    set(state => ({
      config: {
        ...state.config,
        equipment: {
          ...state.config.equipment,
          weapon: weaponId,
        },
      },
    }))
  },

  // ── Sorts ─────────────────────────────────────────────────

  addSpell: (spell) => {
    set(state => ({
      config: {
        ...state.config,
        spells: [...state.config.spells, spell],
      },
    }))
  },

  removeSpell: (spellId) => {
    set(state => ({
      config: {
        ...state.config,
        spells: state.config.spells.filter(s => s.id !== spellId),
      },
    }))
  },

  updateSpellShape: (spellId, shape) => {
    set(state => ({
      config: {
        ...state.config,
        spells: updateSpell(state.config.spells, spellId, s => ({
          ...s,
          shape: { ...s.shape, ...shape },
        })),
      },
    }))
  },

  updateSpellType: (spellId, type) => {
    set(state => ({
      config: {
        ...state.config,
        spells: updateSpell(state.config.spells, spellId, s => ({
          ...s,
          type: { ...s.type, ...type },
        })),
      },
    }))
  },

  updateModifier: (spellId, modifierId, value) => {
    set(state => ({
      config: {
        ...state.config,
        spells: updateSpell(state.config.spells, spellId, s => ({
          ...s,
          modifiers: s.modifiers.map(m =>
            m.id === modifierId ? { ...m, value } : m
          ),
        })),
      },
    }))
  },

  addModifier: (spellId, modifier) => {
    set(state => ({
      config: {
        ...state.config,
        spells: updateSpell(state.config.spells, spellId, s => ({
          ...s,
          modifiers: [...s.modifiers, modifier],
        })),
      },
    }))
  },

  removeModifier: (spellId, modifierId) => {
    set(state => ({
      config: {
        ...state.config,
        spells: updateSpell(state.config.spells, spellId, s => ({
          ...s,
          modifiers: s.modifiers.filter(m => m.id !== modifierId),
        })),
      },
    }))
  },

  // ── Sélecteurs ────────────────────────────────────────────

  getComputedStats: (spellId) => {
    const { config } = get()
    const spell = spellId
      ? config.spells.find(s => s.id === spellId) ?? null
      : null
    return computeStats(config.base, config.equipment, spell)
  },

  getSpellValidity: (spellId) => {
    const spell = get().config.spells.find(s => s.id === spellId)
    if (!spell) return 'empty'
    return computeSpellValidity(spell)
  },

  getEquipmentBonus: () => {
    return computeEquipmentBonus(get().config.equipment)
  },
}))