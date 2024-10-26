import { AbcPitch, parseAbcPitch } from "~/model/abc-pitch";
import { naturalPitchClasses } from "~/model/pitch-class";

export type NaturalPitchNumber = number;

const positiveModulo = (a: number, b: number) => ((a % b) + b) % b;

export function naturalPitchNumberToAbcPitch(
  pitchClassNumber: NaturalPitchNumber,
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

export function abcPitchToNaturalPitchNumber(
  abcPitch: AbcPitch,
): NaturalPitchNumber {
  const { naturalPitchClass, octave } = parseAbcPitch(abcPitch);

  const pitchClassIndex = naturalPitchClasses.indexOf(naturalPitchClass);
  return pitchClassIndex + octave * 7;
}
