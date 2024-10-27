import { ExerciseSettings } from "~/model/generate-exercise";
import { naturalRange } from "~/model/natural-range";
import { diatonicScaleDegrees } from "~/model/scale-degree";

export const defaultSettings: ExerciseSettings = {
  numberOfSegments: 8 * 4,
  scaleDegrees: diatonicScaleDegrees,
  hand: "right",
  chords: [],
  voicing: ["close"],
  leftHandOctaveDoubling: ["no"],
  rightHandOctaveDoubling: ["no"],
  tonic: "C",
  rhRange: naturalRange("A,", "C''"),
  lhRange: naturalRange("C,,", "E"),
  maxInterval: 7,
  maxBassInterval: 4,
  maxOverallRange: 11,
};
