import { first, last } from "lodash";
import { ExerciseSettings } from "~/model/generate-exercise";
import {
  ChordType,
  RomanNumeral,
  RomanNumeralChord,
} from "~/model/roman-numeral-chord";
import { ScaleDegree } from "~/model/scale-degree";
import { ScaleDegreeVoicing } from "~/model/voicing";

function addInterval(scaleDegree: ScaleDegree, interval: number) {
  const scaleDegreeNumber = +scaleDegree;
  let number = ((scaleDegreeNumber - 1 + interval) % 7) + 1;
  if (number < 0) {
    number += 7;
  }
  return number.toString() as ScaleDegree;
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

const positionToNormalizedNumericInterval: Record<
  ExerciseSettings["positions"][number],
  number
> = {
  "8th": 0,
  "3rd": 2,
  "5th": 4,
};

export function chordVoicings(
  chord: RomanNumeralChord,
  settings: Pick<
    ExerciseSettings,
    | "voicing"
    | "rightHandOctaveDoubling"
    | "leftHandOctaveDoubling"
    | "positions"
  >,
) {
  const match = chord.match(/^(.*?)(6|64)?$/);

  if (!match) {
    throw new Error(`Invalid chord: ${chord}`);
  }

  const [, base, chordType] = match;

  const bassIndex = bassIndexFromInversion[(chordType ?? "") as ChordType];
  const root = romanNumeralToScaleDegree[base as RomanNumeral];

  if (!root) {
    throw new Error(`Chord ${chord} is not supported`);
  }

  const pitches = buildThirds(root, 3);
  const bass = pitches[bassIndex];

  const closeVoicings: ScaleDegreeVoicing[] = [];

  const allowedSopranoPositionsInNumbers = settings.positions.map(
    (position) => positionToNormalizedNumericInterval[position],
  );

  for (let i = 0; i < pitches.length; i++) {
    const sopranoVoice = last(pitches)!;
    let intervalToRoot = +sopranoVoice - +root;
    if (intervalToRoot < 0) {
      intervalToRoot += 7;
    }

    if (allowedSopranoPositionsInNumbers.includes(intervalToRoot)) {
      closeVoicings.push({
        rHand: [...pitches],
        lHand: [bass],
      });
    }

    const firstPitch = pitches.shift()!;
    pitches.push(firstPitch);
  }

  const openVoicings = closeVoicings.map((closeVoicings) => {
    const rhNotes = [...closeVoicings.rHand];
    const middleNote = rhNotes.splice(1, 1)[0];
    return {
      rHand: rhNotes,
      lHand: [...closeVoicings.lHand, middleNote],
    };
  });

  const allVoicings = [];

  if (settings.voicing.includes("close")) {
    allVoicings.push(...closeVoicings);
  }
  if (settings.voicing.includes("open")) {
    allVoicings.push(...openVoicings);
  }

  if (settings.leftHandOctaveDoubling.includes("yes")) {
    const withLeftHandDoubling = allVoicings.map((voicing) => {
      if (voicing.lHand.slice(1).includes(voicing.lHand[0])) {
        return voicing;
      }

      return {
        ...voicing,
        lHand: [...voicing.lHand, addInterval(first(voicing.lHand)!, 7)],
      };
    });

    if (!settings.leftHandOctaveDoubling.includes("no")) {
      allVoicings.length = 0;
    }

    allVoicings.push(...withLeftHandDoubling);
  }

  if (settings.rightHandOctaveDoubling.includes("yes")) {
    const withRightHandDoubling = allVoicings.map((voicing) => ({
      ...voicing,
      rHand: [addInterval(last(voicing.rHand)!, -7), ...voicing.rHand],
    }));

    if (!settings.rightHandOctaveDoubling.includes("no")) {
      allVoicings.length = 0;
    }

    allVoicings.push(...withRightHandDoubling);
  }

  return allVoicings;
}
