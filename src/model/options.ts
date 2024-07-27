import { ScaleDegree } from "@/app/scale-degree";

export interface Option {
  name: string;
  degrees: ScaleDegree[];
}

// todo: consider supporting solfegge notation
export const scaleDegreesOptions: Option[] = [1, 2, 3, 4, 5, 6, 7].map(
  (diatonic) => ({
    name: diatonic.toString(),
    degrees: [diatonic.toString() as ScaleDegree],
  }),
);
