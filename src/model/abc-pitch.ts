import { NaturalPitchClass } from "~/model/pitch-class";

export type AbcPitch =
  `${NaturalPitchClass}${"" | "," | ",," | ",,," | "'" | "''" | "'''"}`;

export function parseAbcPitch(abcPitch: AbcPitch) {
  let naturalPitchClass = abcPitch[0] as NaturalPitchClass;
  let octave = 0;

  for (let i = 1; i < abcPitch.length; i++) {
    if (abcPitch[i] === ",") {
      octave--;
    } else if (abcPitch[i] === "'") {
      octave++;
    }
  }

  return {
    naturalPitchClass,
    octave,
  };
}
