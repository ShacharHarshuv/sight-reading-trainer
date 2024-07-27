import { ExerciseSettings } from "~/model/generate-exercise";
import { naturalRange } from "~/model/natural-range";
import { diatonicScaleDegrees } from "~/model/scale-degree";

export const defaultSettings: ExerciseSettings = {
  numberOfSegments: 8 * 4,
  scaleDegrees: diatonicScaleDegrees,
  tonic: "C",
  range: naturalRange("A,", "C''"),
  maxInterval: 7,
  maxOverallRange: 11,
};
