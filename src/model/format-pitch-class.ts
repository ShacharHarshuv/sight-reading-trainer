import { Accidental } from "@/app/accidental";
import { PitchClass, parsePitchClass } from "@/app/pitch-class";

const accidentalToCharacter: { [key in Accidental]: string } = {
  b: "♭",
  "#": "♯",
};

export function formatPitchClass(key: PitchClass) {
  const { naturalPitchClass, accidental } = parsePitchClass(key);
  return (
    naturalPitchClass + (accidental ? accidentalToCharacter[accidental] : "")
  );
}
