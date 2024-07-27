export const diatonicScaleDegrees = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
] as const;
type DiatonicScaleDegree = (typeof diatonicScaleDegrees)[number];

export type ScaleDegree = `${"" | "b" | "#"}${DiatonicScaleDegree}`;

export function parseScaleDegree(scaleDegree: ScaleDegree): {
  diatonic: DiatonicScaleDegree;
  accidental: "" | "b" | "#";
} {
  const maybeAccidental = scaleDegree[0];
  if (maybeAccidental === "b" || maybeAccidental === "#") {
    return {
      diatonic: scaleDegree[1] as DiatonicScaleDegree,
      accidental: maybeAccidental,
    };
  } else {
    return {
      diatonic: scaleDegree as DiatonicScaleDegree,
      accidental: "",
    };
  }
}
