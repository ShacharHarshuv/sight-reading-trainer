import { first, isEmpty, isEqual } from "lodash";
import { AbcPitch } from "~/model/abc-pitch";
import { chordVoicings } from "~/model/chord-voicing";
import { abcPitchToNaturalPitchNumber } from "~/model/natural-pitch-number";
import {
  intersectNaturalRanges,
  NaturalRange,
  naturalRange,
  naturalRangeFrom,
  unionNaturalRanges,
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
  voicing: readonly ("open" | "close")[];
  leftHandOctaveDoubling: readonly ("no" | "yes")[];
  rightHandOctaveDoubling: readonly ("no" | "yes")[];
  tonic: PitchClass;
  rhRange: NaturalRange;
  lhRange: NaturalRange;
  maxInterval: number;
  maxBassInterval: number;
  maxOverallRange: number;
}

export const RIGHT_HAND_INDEX = 0;
export const LEFT_HAND_INDEX = 1;

type ExerciseSegment = [AbcPitch[], AbcPitch[]];

function getScaleDegreeVoicings(
  config: ExerciseSettings,
): ScaleDegreeVoicing[] {
  const individualNotes = config.scaleDegrees.map((scaleDegree) => {
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

  const chords = config.chords.flatMap((chord) => chordVoicings(chord, config));

  return [...individualNotes, ...chords];
}

export function generateExercise(config: ExerciseSettings): ExerciseSegment[] {
  let lastAbcVoicing: AbcPitchVoicing | null = null;
  let highestSoprano: AbcPitch | null = null;
  let lowestSoprano: AbcPitch | null = null;

  return new Array(config.numberOfSegments)
    .fill(null)
    .map((_, i): ExerciseSegment => {
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
      const sopranoRange =
        i === 0
          ? unionNaturalRanges(config.lhRange, config.rhRange)
          : intersectNaturalRanges(
              ...[maxIntervalLimit, overallLimit].filter(isDefined),
            );

      const voicings = getScaleDegreeVoicings(config);

      if (isEmpty(voicings)) {
        console.log("Nothing is selected");
        return [[], []];
      }

      const options = voicings
        .flatMap((scaleDegreeVoicing) => {
          return scaleDegreeVoicingToAbcPitchesOptions(scaleDegreeVoicing, {
            key: config.tonic,
            sopranoRange,
            rHandRange: config.rhRange,
            lHandRange: config.lhRange,
          });
        })
        .filter((option) => !isEqual(option, lastAbcVoicing))
        .filter((option) => {
          if (
            !lastAbcVoicing ||
            option.rHand.length + option.lHand.length === 1
          ) {
            return true;
          }

          const lastBass = first(lastAbcVoicing.lHand);

          if (!lastBass) {
            return true;
          }

          const currentBass = first(option.lHand);

          if (!currentBass) {
            return true;
          }

          return (
            Math.abs(
              abcPitchToNaturalPitchNumber(currentBass) -
                abcPitchToNaturalPitchNumber(lastBass),
            ) <= config.maxBassInterval
          );
        });

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
