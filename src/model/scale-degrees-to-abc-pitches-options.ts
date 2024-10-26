import { AbcPitch, parseAbcPitch } from "~/model/abc-pitch";
import { naturalPitchNumberToAbcPitch } from "~/model/natural-pitch-number";
import {
  NaturalRange,
  allNaturalPitchNumbersInRange,
} from "~/model/natural-range";
import { PitchClass } from "~/model/pitch-class";
import { ScaleDegree } from "~/model/scale-degree";
import { scaleDegreeToAbcNaturalPitchClass } from "~/model/scale-degree-to-abc-natural-pitch-class";

export function scaleDegreesToAbcPitchesOptions(
  scaleDegree: ScaleDegree,
  key: PitchClass,
  range: NaturalRange,
): AbcPitch[] {
  const pitchClass = scaleDegreeToAbcNaturalPitchClass(scaleDegree, key);

  return allNaturalPitchNumbersInRange(range)
    .map(naturalPitchNumberToAbcPitch)
    .filter(
      (abcPitch) => parseAbcPitch(abcPitch).naturalPitchClass === pitchClass,
    );
}
