import { mapValues } from "lodash";
import { parseAbcPitch } from "~/model/abc-pitch";
import {
  abcPitchToNaturalPitchNumber,
  naturalPitchNumberToAbcPitch,
} from "~/model/natural-pitch-number";
import {
  NaturalRange,
  allNaturalPitchNumbersInRange,
  intersectNaturalRanges,
  isInNaturalRange,
} from "~/model/natural-range";
import { PitchClass } from "~/model/pitch-class";
import { scaleDegreeToAbcNaturalPitchClass } from "~/model/scale-degree-to-abc-natural-pitch-class";
import {
  AbcPitchVoicing,
  PitchClassVoicing,
  ScaleDegreeVoicing,
} from "~/model/voicing";

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

  const { currentVoice, restVoicing, currentRange, hand } = ((): {
    currentVoice: PitchClass;
    restVoicing: PitchClassVoicing;
    currentRange: NaturalRange;
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
        currentRange: intersectNaturalRanges(
          options.sopranoRange,
          options.range.rHand,
        ),
      };
    } else if (voicing.lHandUpperVoices.length) {
      console.log("voicing upper voices");
      const [currentVoice, ...restLHandUpperVoices] = voicing.lHandUpperVoices;
      return {
        hand: "lHand",
        currentVoice: currentVoice,
        restVoicing: {
          ...voicing,
          lHandUpperVoices: restLHandUpperVoices,
        },
        currentRange: intersectNaturalRanges(
          options.sopranoRange,
          options.range.lHand,
        ),
      };
    } else {
      const [currentVoice, ...restLHandBass] = voicing.lHandBass;
      const bassRange = intersectNaturalRanges(
        options.sopranoRange, // the bass can be more than an octave apart from the upper voices
        options.range.lHand,
      );
      return {
        hand: "lHand",
        currentVoice: currentVoice,
        restVoicing: {
          ...voicing,
          lHandBass: restLHandBass,
        },
        currentRange: bassRange,
      };
    }
  })();

  const currentVoiceOptions = allNaturalPitchNumbersInRange(currentRange)
    .map(naturalPitchNumberToAbcPitch)
    .filter((sopranoOptionCandidate) => {
      const { naturalPitchClass } = parseAbcPitch(sopranoOptionCandidate);
      return naturalPitchClass === currentVoice;
    });

  const allOptions: AbcPitchVoicing[] = currentVoiceOptions.flatMap(
    (sopranoOption): AbcPitchVoicing[] => {
      const nextVoiceRange: NaturalRange = [
        // the voice will have to be at least a step and no more than an octave the current one
        abcPitchToNaturalPitchNumber(sopranoOption) - 7,
        abcPitchToNaturalPitchNumber(sopranoOption) - 1,
      ];

      const restOptions = pitchClassVoicingToAbcPitchesOptions(restVoicing, {
        sopranoRange: nextVoiceRange, // todo: we need to change it for the case that the next thing we need to do is only bass. It should be unlimited if there is no lHand upper voices, but limited by a specified interval (say, an 10th) if there are.
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
