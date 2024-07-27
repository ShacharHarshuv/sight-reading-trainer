import { isEmpty } from "lodash";
import { AbcPitch } from "~/model/abc-pitch";
import { abcPitchToNaturalPitchClassNumber } from "~/model/natural-pitch-class-number";
import {
  mergeNaturalRanges,
  NaturalRange,
  naturalRange,
  naturalRangeFrom,
} from "~/model/natural-range";
import { PitchClass } from "~/model/pitch-class";
import { randomElement } from "~/model/random-element";
import { ScaleDegree } from "~/model/scale-degree";
import { scaleDegreeToAbcPitches } from "~/model/scale-degree-to-abc";
import { isDefined } from "~/ts-utils/is-defined";

export interface ExerciseSettings {
  numberOfSegments: number;
  scaleDegrees: readonly ScaleDegree[];
  hand: "left" | "right";
  tonic: PitchClass;
  rhRange: NaturalRange;
  lhRange: NaturalRange;
  maxInterval: number;
  maxOverallRange: number;
}

export const RIGHT_HAND_INDEX = 0;
export const LEFT_HAND_INDEX = 1;

type ExerciseSegment = [AbcPitch[], AbcPitch[]];

export function generateExercise(config: ExerciseSettings): ExerciseSegment[] {
  let lastOption: AbcPitch | null = null;
  let highestOption: AbcPitch | null = null;
  let lowestOption: AbcPitch | null = null;
  return new Array(config.numberOfSegments)
    .fill(null)
    .map((): ExerciseSegment => {
      const consumerLimit =
        config.hand === "right" ? config.rhRange : config.lhRange;
      const maxIntervalLimit =
        lastOption && naturalRangeFrom(lastOption, config.maxInterval);
      const overallLimit = ((): NaturalRange | null => {
        if (!highestOption || !lowestOption) {
          return null;
        }

        const highestNumber = abcPitchToNaturalPitchClassNumber(highestOption);
        const lowestNumber = abcPitchToNaturalPitchClassNumber(lowestOption);
        const wiggleRoom =
          config.maxOverallRange - (highestNumber - lowestNumber);
        return naturalRange(
          highestNumber + wiggleRoom,
          lowestNumber - wiggleRoom,
        );
      })();
      const range = mergeNaturalRanges(
        ...[consumerLimit, maxIntervalLimit, overallLimit].filter(isDefined),
      );
      const options = config.scaleDegrees
        .flatMap((scaleDegree) =>
          scaleDegreeToAbcPitches(scaleDegree, config.tonic, range),
        )
        .filter((option) => option !== lastOption);

      if (isEmpty(options)) {
        console.error("No options available", {
          consumerLimit,
          maxIntervalLimit,
          overallLimit,
          range,
          lastOption,
          highestOption,
          lowestOption,
        });
        return [[], []];
      }

      const selectedOption = randomElement(options);
      lastOption = selectedOption;

      if (
        !highestOption ||
        abcPitchToNaturalPitchClassNumber(selectedOption) >
          abcPitchToNaturalPitchClassNumber(highestOption)
      ) {
        highestOption = selectedOption;
      }
      if (
        !lowestOption ||
        abcPitchToNaturalPitchClassNumber(selectedOption) <
          abcPitchToNaturalPitchClassNumber(lowestOption)
      ) {
        lowestOption = selectedOption;
      }

      if (config.hand === "right") {
        return [[selectedOption], []];
      } else {
        return [[], [selectedOption]];
      }
    });
}
