import { AbcPitch } from "~/model/abc-pitch";
import { PitchClass } from "~/model/pitch-class";
import { ScaleDegree } from "~/model/scale-degree";

export type VoicingWithBassSeparation<Note> = {
  rHand: Note[];
  lHandUpperVoices: Note[];
  lHandBass: Note[];
};

export type PianoVoicing<Note> = {
  rHand: Note[];
  lHand: Note[];
};

export type ScaleDegreeVoicing = VoicingWithBassSeparation<ScaleDegree>;

export type PitchClassVoicing = VoicingWithBassSeparation<PitchClass>;

export type AbcPitchVoicing = PianoVoicing<AbcPitch>;
