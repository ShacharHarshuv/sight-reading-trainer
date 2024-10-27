import { last } from "lodash";
import {
  ChordType,
  RomanNumeral,
  RomanNumeralChord,
} from "~/model/roman-numeral-chord";
import { ScaleDegree } from "~/model/scale-degree";

function addInterval(scaleDegree: ScaleDegree, interval: number) {
  const scaleDegreeNumber = +scaleDegree;
  return (
    ((scaleDegreeNumber - 1 + interval) % 7) +
    1
  ).toString() as ScaleDegree;
}

function buildThirds(root: ScaleDegree, numberOfNotes: number) {
  const notes = [root];
  numberOfNotes--;
  while (numberOfNotes > 0) {
    notes.push(addInterval(last(notes)!, 2));
    numberOfNotes--;
  }
  return notes;
}

const bassIndexFromInversion: Record<ChordType, number> = {
  "": 0,
  "6": 1,
  "64": 2,
};

const romanNumeralToScaleDegree: Partial<Record<RomanNumeral, ScaleDegree>> = {
  I: "1",
  ii: "2",
  iii: "3",
  IV: "4",
  V: "5",
  vi: "6",
  viio: "7",
};

export function chordVoicings(chord: RomanNumeralChord) {
  const match = chord.match(/^(.*?)(6|64)?$/);

  if (!match) {
    throw new Error(`Invalid chord: ${chord}`);
  }

  const [, base, chordType] = match;
  console.log("chordType", chordType); // todo

  const bassIndex = bassIndexFromInversion[(chordType ?? "") as ChordType];
  console.log("bassIndex", bassIndex);
  const root = romanNumeralToScaleDegree[base as RomanNumeral];

  if (!root) {
    throw new Error(`Chord ${chord} is not supported`);
  }

  const pitches = buildThirds(root, 3);
  const bass = pitches[bassIndex];

  // todo: we need to support more types of voicings (other close positions, open positions, etc.)
  return [
    {
      rHand: pitches.reverse(), // we expect the voicing to be top to bottom
      lHand: [bass],
    },
  ];
}
