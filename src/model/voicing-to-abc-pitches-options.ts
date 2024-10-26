import { mapValues } from "lodash";
import { parseAbcPitch } from "~/model/abc-pitch";
import {
  abcPitchToNaturalPitchNumber,
  naturalPitchNumberToAbcPitch,
} from "~/model/natural-pitch-number";
import {
  NaturalRange,
  allNaturalPitchNumbersInRange,
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
    rHandRange: NaturalRange;
    lHandRange: NaturalRange;
  },
): AbcPitchVoicing[] {
  const voicingAbcPitchClasses = mapValues(voicing, (scaleDegrees) =>
    scaleDegrees.map((scaleDegree) =>
      scaleDegreeToAbcNaturalPitchClass(scaleDegree, options.key),
    ),
  );

  return pitchClassVoicingToAbcPitchesOptions(voicingAbcPitchClasses, {
    ...options,
    originalSopranoRange: options.sopranoRange,
  });
}

function pitchClassVoicingToAbcPitchesOptions(
  voicing: PitchClassVoicing,
  options: {
    originalSopranoRange: NaturalRange; // todo: do we need this?
    sopranoRange: NaturalRange;
    rHandRange: NaturalRange;
    lHandRange: NaturalRange;
  },
): AbcPitchVoicing[] {
  // null means the requested voicing is impossible
  if (voicing.lHand.length === 0 && voicing.rHand.length === 0) {
    return [
      {
        rHand: [],
        lHand: [],
      },
    ];
  }

  if (voicing.rHand.length !== 0) {
    const [sopranoPitchClass, ...rHandRest] = voicing.rHand;
    const sopranoOptions = allNaturalPitchNumbersInRange(options.sopranoRange)
      .map(naturalPitchNumberToAbcPitch)
      .filter((sopranoOptionCandidate) => {
        const { naturalPitchClass } = parseAbcPitch(sopranoOptionCandidate);
        return naturalPitchClass === sopranoPitchClass;
      });

    const allOptions: AbcPitchVoicing[] = sopranoOptions
      .flatMap((sopranoOption): AbcPitchVoicing[] => {
        const restOptions = pitchClassVoicingToAbcPitchesOptions(
          {
            rHand: rHandRest,
            lHand: voicing.lHand,
          },
          {
            originalSopranoRange: options.originalSopranoRange,
            sopranoRange: [
              abcPitchToNaturalPitchNumber(sopranoOption) - 12,
              abcPitchToNaturalPitchNumber(sopranoOption) - 1,
            ],
            rHandRange: options.rHandRange,
            lHandRange: options.lHandRange,
          },
        );

        return restOptions.map(
          (restOption): AbcPitchVoicing => ({
            rHand: [sopranoOption, ...restOption.rHand],
            lHand: restOption.lHand,
          }),
        );
      })
      .filter((voicingOption) => {
        return ["rHand" as const, "lHand" as const].every((hand) => {
          return (
            !voicingOption[hand].length ||
            voicingOption[hand].some((abcPitch) =>
              isInNaturalRange(options.rHandRange, abcPitch),
            )
          );
        });
      });

    return allOptions;
  } else {
    // TODO: we need to eliminate this duplication somehow
    const [sopranoPitchClass, ...lHandRest] = voicing.lHand;
    const sopranoOptions = allNaturalPitchNumbersInRange(options.sopranoRange)
      .map(naturalPitchNumberToAbcPitch)
      .filter((sopranoOptionCandidate) => {
        const { naturalPitchClass } = parseAbcPitch(sopranoOptionCandidate);
        return naturalPitchClass === sopranoPitchClass;
      });

    const allOptions: AbcPitchVoicing[] = sopranoOptions
      .flatMap((sopranoOption): AbcPitchVoicing[] => {
        const restOptions = pitchClassVoicingToAbcPitchesOptions(
          {
            rHand: [],
            lHand: lHandRest,
          },
          {
            originalSopranoRange: options.originalSopranoRange,
            sopranoRange: [
              abcPitchToNaturalPitchNumber(sopranoOption) - 12,
              abcPitchToNaturalPitchNumber(sopranoOption) - 1,
            ],
            rHandRange: options.rHandRange,
            lHandRange: options.lHandRange,
          },
        );

        return restOptions.map(
          (restOption): AbcPitchVoicing => ({
            rHand: [],
            lHand: [sopranoOption, ...restOption.lHand],
          }),
        );
      })
      .filter((voicingOption) => {
        return ["rHand" as const, "lHand" as const].every((hand) => {
          return (
            !voicingOption[hand].length ||
            voicingOption[hand].some((abcPitch) =>
              isInNaturalRange(
                options[(hand + "Range") as "rHandRange" | "lHandRange"],
                abcPitch,
              ),
            )
          );
        });
      });

    return allOptions;
  }
}
