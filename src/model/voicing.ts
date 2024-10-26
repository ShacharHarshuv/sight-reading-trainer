import { AbcPitch } from "~/model/abc-pitch";
import { PitchClass } from "~/model/pitch-class";
import { ScaleDegree } from "~/model/scale-degree";

export type Voicing<Note> = {
  rHand: Note[];
  lHand: Note[];
};

export type ScaleDegreeVoicing = Voicing<ScaleDegree>;

export type PitchClassVoicing = Voicing<PitchClass>;

export type AbcPitchVoicing = Voicing<AbcPitch>;
