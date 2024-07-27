import { parseAbcPitch } from "~/model/abc-pitch";
import { naturalPitchClassNumberToAbcPitch } from "~/model/natural-pitch-class-number";
import {
  NaturalRange,
  allNaturalPitchClassNumbersInRange,
} from "~/model/natural-range";
import {
  PitchClass,
  naturalPitchClasses,
  parsePitchClass,
} from "~/model/pitch-class";
import { ScaleDegree, parseScaleDegree } from "~/model/scale-degree";

export function scaleDegreeToAbcPitches(
  scaleDegree: ScaleDegree,
  key: PitchClass,
  range: NaturalRange,
) {
  const scaleDegreeParse = parseScaleDegree(scaleDegree);

  if (scaleDegreeParse.accidental) {
    throw new Error("Accidentals not supported in ABC notation yet");
  }

  const keyParse = parsePitchClass(key);

  const alphabetSize = naturalPitchClasses.length;
  const keyNaturalPitchClassIndex = naturalPitchClasses.indexOf(
    keyParse.naturalPitchClass,
  );
  const scaleDegreeNaturalPitchClassIndexDifference =
    parseInt(scaleDegreeParse.diatonic) - 1;
  const targetNaturalPitchClassIndex =
    (keyNaturalPitchClassIndex + scaleDegreeNaturalPitchClassIndexDifference) %
    alphabetSize;
  const targetNaturalPitchClass =
    naturalPitchClasses[targetNaturalPitchClassIndex];
  return allNaturalPitchClassNumbersInRange(range)
    .map(naturalPitchClassNumberToAbcPitch)
    .filter((abcPitch) => {
      const { naturalPitchClass, octave } = parseAbcPitch(abcPitch);
      return naturalPitchClass === targetNaturalPitchClass;
    });
}
