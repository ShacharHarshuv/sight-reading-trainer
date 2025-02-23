import { mapValues } from "lodash";
import { parseAbcPitch } from "~/model/abc-pitch";
import {
  NaturalPitchNumber,
  abcPitchToNaturalPitchNumber,
  naturalPitchNumberToAbcPitch,
} from "~/model/natural-pitch-number";
import {
  NaturalRange,
  allNaturalPitchNumbersInRange,
  intersectNaturalRanges,
  isInNaturalRange,
  naturalRange,
} from "~/model/natural-range";
import { PitchClass } from "~/model/pitch-class";
import { scaleDegreeToAbcNaturalPitchClass } from "~/model/scale-degree-to-abc-natural-pitch-class";
import {
  AbcPitchVoicing,
  PitchClassVoicing,
  ScaleDegreeVoicing,
} from "~/model/voicing";

const maxHandSize = 10; // todo: consider enable customizing this in the UI later
const octave = 8;

export function scaleDegreeVoicingToAbcPitchesOptions(
  voicing: ScaleDegreeVoicing,
  options: {
    key: PitchClass;
    sopranoRange: NaturalRange;
    range: { [key in keyof AbcPitchVoicing]: NaturalRange };
  },
): AbcPitchVoicing[] {
  const voicingAbcPitchClasses: PitchClassVoicing = mapValues(
    voicing,
    (scaleDegrees) =>
      scaleDegrees
        .map((scaleDegree) =>
          scaleDegreeToAbcNaturalPitchClass(scaleDegree, options.key),
        )
        .reverse(), // the degrees are written from bottom to top, but we voice them from top to bottom
  );

  return pitchClassVoicingToAbcPitchesOptions(voicingAbcPitchClasses, {
    ...options,
  }).filter((voicingOption) => {
    return (Object.keys(voicingOption) as (keyof AbcPitchVoicing)[]).every(
      (hand) => {
        return (
          !voicingOption[hand].length ||
          voicingOption[hand].some((abcPitch) =>
            isInNaturalRange(options.range[hand], abcPitch),
          )
        );
      },
    );
  });
}

function pitchClassVoicingToAbcPitchesOptions(
  voicing: PitchClassVoicing,
  options: {
    sopranoRange: NaturalRange;
    range: { [key in keyof AbcPitchVoicing]: NaturalRange }; // todo: reuse this type? // TODO: do we really need 3 separate ranges here, or can be we just rely on the soprano range to enforce proper voicing?
  },
): AbcPitchVoicing[] {
  // null means the requested voicing is impossible
  if (
    voicing.rHand.length === 0 &&
    voicing.lHandUpperVoices.length === 0 &&
    voicing.lHandBass.length === 0
  ) {
    return [
      {
        rHand: [],
        lHand: [],
      },
    ];
  }

  const { currentVoice, restVoicing, hand, nextNoteRange } = ((): {
    currentVoice: PitchClass;
    restVoicing: PitchClassVoicing;
    nextNoteRange: (
      currentlyChosenNaturalPitch: NaturalPitchNumber,
    ) => NaturalRange;
    hand: keyof AbcPitchVoicing;
  } => {
    // todo: there is still duplication here.
    if (voicing.rHand.length) {
      const [currentVoice, ...restRHandVoices] = voicing.rHand;
      return {
        hand: "rHand",
        currentVoice: currentVoice,
        restVoicing: {
          ...voicing,
          rHand: restRHandVoices,
        },
        nextNoteRange: (currentlyChosenNaturalPitch) =>
          naturalRange(
            // if we have more "upper voices", we need to limit by an octave. If not and we don't have upper voices in left hand, the bass can be as low as it wants
            currentlyChosenNaturalPitch -
              (restRHandVoices.length || voicing.lHandUpperVoices.length
                ? octave
                : Infinity) +
              1,
            currentlyChosenNaturalPitch - 1,
          ),
      };
    } else if (voicing.lHandUpperVoices.length) {
      const [currentVoice, ...restLHandUpperVoices] = voicing.lHandUpperVoices;
      return {
        hand: "lHand",
        currentVoice: currentVoice,
        restVoicing: {
          ...voicing,
          lHandUpperVoices: restLHandUpperVoices,
        },
        nextNoteRange: (currentlyChosenNaturalPitch) =>
          // If we have no more upper voices, the bass can be as low as it wants, except we are limited hand size
          naturalRange(
            currentlyChosenNaturalPitch -
              (restLHandUpperVoices.length ? octave : maxHandSize) +
              1,
            currentlyChosenNaturalPitch - 1,
          ),
      };
    } else {
      const [currentVoice, ...restLHandBass] = voicing.lHandBass;
      return {
        hand: "lHand",
        currentVoice: currentVoice,
        restVoicing: {
          ...voicing,
          lHandBass: restLHandBass,
        },
        nextNoteRange: (currentlyChosenNaturalPitch) => {
          return naturalRange(
            currentlyChosenNaturalPitch - octave + 1,
            currentlyChosenNaturalPitch - 1,
          );
        },
      };
    }
  })();

  const currentVoiceOptions = allNaturalPitchNumbersInRange(
    intersectNaturalRanges(options.sopranoRange, options.range[hand]),
  )
    .map(naturalPitchNumberToAbcPitch)
    .filter((sopranoOptionCandidate) => {
      const { naturalPitchClass } = parseAbcPitch(sopranoOptionCandidate);
      return naturalPitchClass === currentVoice;
    });

  const allOptions: AbcPitchVoicing[] = currentVoiceOptions.flatMap(
    (sopranoOption): AbcPitchVoicing[] => {
      const restOptions = pitchClassVoicingToAbcPitchesOptions(restVoicing, {
        sopranoRange: nextNoteRange(
          abcPitchToNaturalPitchNumber(sopranoOption),
        ),
        range: options.range,
      });

      return restOptions.map(
        (restOption): AbcPitchVoicing => ({
          ...restOption,
          [hand]: [sopranoOption, ...restOption[hand]],
        }),
      );
    },
  );

  return allOptions;
}
