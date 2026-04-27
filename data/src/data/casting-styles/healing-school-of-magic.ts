import { CastingStyleSchema } from "../../schemas/index.js";

/**
 * Healing — school of magic subclass.
 *
 * Source: site/content/Rules/Chapter 3 - Schools of Magic.md (Healing section).
 */
export const healingSchoolOfMagic = CastingStyleSchema.parse({
  id: "healing-school-of-magic",
  foundryId: "OhycVSevKDIBxbE2",
  type: "subclass",
  identifier: "healing",
  classIdentifier: "",
  source: "W&W p.22",
  spellcastingProgression: "none",

  choices: [
    { title: "Medical Studies",     pool: ["natural-remedies",    "unshakable-nerves"],     picksByLevel: { "1":  1 } },
    { title: "Dedicated Protector", pool: ["accelerated-recovery", "durable-shielding"],    picksByLevel: { "6":  1 } },
    { title: "Moral Support",       pool: ["phoenix-song",         "empathic-bond"],        picksByLevel: { "10": 1 } },
    { title: "Combat Medic",        pool: ["extended-assistance",  "a-saving-people-thing"], picksByLevel: { "14": 1 } },
    { title: "Savior",              pool: ["phoenix-tears",        "healing-pulse"],        picksByLevel: { "18": 1 } },
  ],
});
