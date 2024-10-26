import {
  PitchClass,
  naturalPitchClasses,
  parsePitchClass,
} from "~/model/pitch-class";
import { ScaleDegree, parseScaleDegree } from "~/model/scale-degree";

export function scaleDegreeToAbcNaturalPitchClass(
  scaleDegree: ScaleDegree,
  key: PitchClass,
): PitchClass {
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
  return naturalPitchClasses[targetNaturalPitchClassIndex];
}
