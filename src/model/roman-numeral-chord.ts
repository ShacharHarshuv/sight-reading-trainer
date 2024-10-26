type MajorRomanNumeral = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII";

type MinorRomanNumeral = "i" | "ii" | "iii" | "iv" | "v" | "vi" | "vii";

type DiminishedRomanNumeral = `${MinorRomanNumeral}${"o"}`;

type AugmentedRomanNumeral = `${MajorRomanNumeral}${"+"}`;

type RomanNumeral =
  `${"#" | "b" | ""}${MajorRomanNumeral | MinorRomanNumeral | DiminishedRomanNumeral | AugmentedRomanNumeral}`;

type ChordTypes = "" | "6" | "64";

export type RomanNumeralChord = `${RomanNumeral}${ChordTypes}`;

export const diatonicTriads: RomanNumeralChord[] = [
  "I",
  "ii",
  "iii",
  "IV",
  "V",
  "vi",
  "viio",
];
