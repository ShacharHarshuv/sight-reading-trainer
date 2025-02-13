import {
  ChordType,
  RomanNumeral,
  RomanNumeralChord,
} from "~/model/roman-numeral-chord";
import { ScaleDegree } from "~/model/scale-degree";

const romanNumeralToScaleDegree: Partial<Record<RomanNumeral, ScaleDegree>> = {
  I: "1",
  ii: "2",
  iii: "3",
  IV: "4",
  V: "5",
  vi: "6",
  viio: "7",
};

export function parseChord(chord: RomanNumeralChord) {
  const match = chord.match(/^(.*?)(6|64|7)?$/);

  if (!match) {
    throw new Error(`Invalid chord: ${chord}`);
  }

  const [, base, chordType] = match;

  const root = romanNumeralToScaleDegree[base as RomanNumeral];

  if (!root) {
    throw new Error(`Chord ${chord} is not supported`);
  }

  return {
    root,
    type: (chordType ?? "") as ChordType,
  };
}
