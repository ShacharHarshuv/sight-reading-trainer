import { first, last } from "lodash";
import { getChordTypeConfig } from "~/model/chord-type-config";
import { ExerciseSettings } from "~/model/generate-exercise";
import { parseChord } from "~/model/parse-chord";
import { RomanNumeralChord } from "~/model/roman-numeral-chord";
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

const positionToNormalizedNumericInterval: Record<
  ExerciseSettings["positions"][number],
  number
> = {
  "8th": 0,
  "3rd": 2,
  "5th": 4,
  "7th": 6,
};

export function chordVoicings(
  chord: RomanNumeralChord,
  settings: Pick<
    ExerciseSettings,
    | "voicing"
    | "rightHandOctaveDoubling"
    | "leftHandOctaveDoubling"
    | "positions"
    | "bassDoubling"
  >,
) {
  const { root, type } = parseChord(chord);
  const { bassIndex, numberOfNotes } = getChordTypeConfig(type);

  const basePitches = buildThirds(root, numberOfNotes);
  const bass = basePitches[bassIndex];
  const doubleBass =
    settings.bassDoubling.includes("yes") ||
    (settings.bassDoubling.includes("only triads") && numberOfNotes === 3);
  const noDoubleBass =
    settings.bassDoubling.includes("no") ||
    (settings.bassDoubling.includes("only triads") && numberOfNotes > 3);
  const voicedPitchesOptions: (typeof basePitches)[] = [];
  if (doubleBass) {
    voicedPitchesOptions.push(basePitches);
  }
  if (noDoubleBass) {
    voicedPitchesOptions.push(
      basePitches.filter((_, index) => index !== bassIndex),
    );
  }

  const closeVoicings: ScaleDegreeVoicing[] = [];

  const allowedSopranoPositionsInNumbers = settings.positions.map(
    (position) => positionToNormalizedNumericInterval[position],
  );

  for (let pitches of voicedPitchesOptions) {
    for (let i = 0; i < pitches.length; i++) {
      const sopranoVoice = last(pitches)!;
      let intervalToRoot = +sopranoVoice - +root;
      if (intervalToRoot < 0) {
        intervalToRoot += 7;
      }

      if (allowedSopranoPositionsInNumbers.includes(intervalToRoot)) {
        closeVoicings.push({
          rHand: [...pitches],
          lHandUpperVoices: [],
          lHandBass: [bass],
        });
      }

      const firstPitch = pitches.shift()!;
      pitches.push(firstPitch);
    }
  }

  const openVoicings = closeVoicings.map(
    (closeVoicings): ScaleDegreeVoicing => {
      const rhNotes = [...closeVoicings.rHand];
      const middleNote = rhNotes.splice(1, 1)[0];
      return {
        rHand: rhNotes,
        lHandUpperVoices: [...closeVoicings.lHandUpperVoices, middleNote],
        lHandBass: closeVoicings.lHandBass,
      };
    },
  );

  const allVoicings = [];

  if (settings.voicing.includes("close")) {
    allVoicings.push(...closeVoicings);
  }
  if (settings.voicing.includes("open")) {
    allVoicings.push(...openVoicings);
  }

  if (settings.leftHandOctaveDoubling.includes("yes")) {
    const withLeftHandDoubling = allVoicings.map((voicing) => {
      if (voicing.lHandUpperVoices.length !== 0) {
        // impossible to double if the left hand already have non-bass (i.e. upper voices) notes
        return voicing;
      }

      return {
        ...voicing,
        lHandBass: [...voicing.lHandBass, first(voicing.lHandBass)!], // double the bass
      };
    });

    if (!settings.leftHandOctaveDoubling.includes("no")) {
      // existing voices has no doubling, so if we don't want that, we remove them.
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
