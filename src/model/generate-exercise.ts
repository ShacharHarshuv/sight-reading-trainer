import { first, isEmpty, isEqual } from "lodash";
import { AbcPitch } from "~/model/abc-pitch";
import { abcPitchToNaturalPitchNumber } from "~/model/natural-pitch-number";
import {
  mergeNaturalRanges,
  NaturalRange,
  naturalRange,
  naturalRangeFrom,
} from "~/model/natural-range";
import { PitchClass } from "~/model/pitch-class";
import { randomElement } from "~/model/random-element";
import { RomanNumeralChord } from "~/model/roman-numeral-chord";
import { ScaleDegree } from "~/model/scale-degree";
import { AbcPitchVoicing, ScaleDegreeVoicing } from "~/model/voicing";
import { scaleDegreeVoicingToAbcPitchesOptions } from "~/model/voicing-to-abc-pitches-options";
import { isDefined } from "~/ts-utils/is-defined";

export interface ExerciseSettings {
  numberOfSegments: number;
  scaleDegrees: readonly ScaleDegree[];
  hand: "left" | "right"; // relevant only for "Scale Degrees"
  chords: readonly RomanNumeralChord[];

  tonic: PitchClass;
  rhRange: NaturalRange;
  lhRange: NaturalRange;
  maxInterval: number;
  maxOverallRange: number;
}

export const RIGHT_HAND_INDEX = 0;
export const LEFT_HAND_INDEX = 1;

type ExerciseSegment = [AbcPitch[], AbcPitch[]];

function getScaleDegreeVoicings(
  config: ExerciseSettings,
): ScaleDegreeVoicing[] {
  return config.scaleDegrees.map((scaleDegree) => {
    if (config.hand === "right") {
      return {
        rHand: [scaleDegree],
        lHand: [],
      };
    } else {
      return {
        rHand: [],
        lHand: [scaleDegree],
      };
    }
  });
}

export function generateExercise(config: ExerciseSettings): ExerciseSegment[] {
  let lastAbcVoicing: AbcPitchVoicing | null = null;
  let highestSoprano: AbcPitch | null = null;
  let lowestSoprano: AbcPitch | null = null;

  return new Array(config.numberOfSegments)
    .fill(null)
    .map((): ExerciseSegment => {
      const lastSoprano =
        lastAbcVoicing &&
        (first(lastAbcVoicing.rHand) || first(lastAbcVoicing.lHand)!);

      const maxIntervalLimit =
        lastSoprano && naturalRangeFrom(lastSoprano, config.maxInterval);

      const overallLimit = ((): NaturalRange | null => {
        if (!highestSoprano || !lowestSoprano) {
          return null;
        }

        const highestNumber = abcPitchToNaturalPitchNumber(highestSoprano);
        const lowestNumber = abcPitchToNaturalPitchNumber(lowestSoprano);
        const wiggleRoom =
          config.maxOverallRange - (highestNumber - lowestNumber);
        return naturalRange(
          highestNumber + wiggleRoom,
          lowestNumber - wiggleRoom,
        );
      })();
      const sopranoRange = mergeNaturalRanges(
        ...[maxIntervalLimit, overallLimit].filter(isDefined),
      );

      const voicings = getScaleDegreeVoicings(config);

      const options = voicings
        .flatMap((scaleDegreeVoicing) =>
          scaleDegreeVoicingToAbcPitchesOptions(scaleDegreeVoicing, {
            key: config.tonic,
            sopranoRange,
            rHandRange: config.rhRange,
            lHandRange: config.lhRange,
          }),
        )
        .filter((option) => !isEqual(option, lastAbcVoicing));

      if (isEmpty(options)) {
        console.error("No options available", {
          maxIntervalLimit,
          overallLimit,
          lastAbcVoicing,
          highestOption: highestSoprano,
          lowestOption: lowestSoprano,
        });
        return [[], []];
      }

      const selectedOption = randomElement(options);
      lastAbcVoicing = selectedOption;

      const currentSoprano =
        first(selectedOption.rHand) || first(selectedOption.lHand)!;

      if (
        !highestSoprano ||
        abcPitchToNaturalPitchNumber(currentSoprano) >
          abcPitchToNaturalPitchNumber(highestSoprano)
      ) {
        highestSoprano = currentSoprano;
      }
      if (
        !lowestSoprano ||
        abcPitchToNaturalPitchNumber(currentSoprano) <
          abcPitchToNaturalPitchNumber(lowestSoprano)
      ) {
        lowestSoprano = currentSoprano;
      }

      return [selectedOption.rHand, selectedOption.lHand];
    });
}
