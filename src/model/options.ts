import { RomanNumeralChord, diatonicTriads } from "~/model/roman-numeral-chord";
import { ScaleDegree } from "~/model/scale-degree";

export const scaleDegreesOptions: ScaleDegree[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
];

const chordTypes = ["", "6", "64", "7"] as const;

export const chordsOptions: RomanNumeralChord[][] = chordTypes.map(
  (chordType) =>
    diatonicTriads.map(
      (romanNumeral) => `${romanNumeral}${chordType}` as RomanNumeralChord,
    ),
);
