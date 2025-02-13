export type MajorRomanNumeral = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";

export type MinorRomanNumeral = "i" | "ii" | "iii" | "iv" | "v" | "vi" | "vii";

type DiminishedRomanNumeral = `${MinorRomanNumeral}${"o"}`;

type AugmentedRomanNumeral = `${MajorRomanNumeral}${"+"}`;

export type RomanNumeral =
  `${"#" | "b" | ""}${MajorRomanNumeral | MinorRomanNumeral | DiminishedRomanNumeral | AugmentedRomanNumeral}`;

export type ChordType = "" | "6" | "64" | "7";

export type RomanNumeralChord = `${RomanNumeral}${ChordType}`;

export const diatonicTriads: RomanNumeralChord[] = [
  "I",
  "ii",
  "iii",
  "IV",
  "V",
  "vi",
  "viio",
];
