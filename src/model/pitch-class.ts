import { Accidental } from "~/model/accidental";

export const naturalPitchClasses = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type NaturalPitchClass = (typeof naturalPitchClasses)[number];

export const pitchClasses = [
  "C",
  "F",
  "Bb",
  "Eb",
  "Ab",
  "Db",
  "Gb",
  "F#",
  "B",
  "E",
  "A",
  "D",
  "G",
] as const;
export type PitchClass = (typeof pitchClasses)[number];

export function parsePitchClass(key: PitchClass) {
  const naturalPitchClass = key[0] as NaturalPitchClass;
  const accidental = (key.slice(1) || null) as Accidental | null;
  return { naturalPitchClass, accidental };
}
