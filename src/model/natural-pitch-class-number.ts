import { AbcPitch, parseAbcPitch } from "~/model/abc-pitch";
import { naturalPitchClasses } from "~/model/pitch-class";

export type NaturalPitchClassNumber = number;

const positiveModulo = (a: number, b: number) => ((a % b) + b) % b;

export function naturalPitchClassNumberToAbcPitch(
  pitchClassNumber: NaturalPitchClassNumber,
): AbcPitch {
  let octave = Math.floor(pitchClassNumber / 7);
  let note = naturalPitchClasses[positiveModulo(pitchClassNumber, 7)];
  while (octave < 0) {
    note += ",";
    octave++;
  }
  while (octave > 0) {
    note += "'";
    octave--;
  }
  return note;
}

export function abcPitchToNaturalPitchClassNumber(
  abcPitch: AbcPitch,
): NaturalPitchClassNumber {
  const { naturalPitchClass, octave } = parseAbcPitch(abcPitch);

  const pitchClassIndex = naturalPitchClasses.indexOf(naturalPitchClass);
  return pitchClassIndex + octave * 7;
}
