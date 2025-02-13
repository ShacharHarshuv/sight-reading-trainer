import { expect, test } from "vitest";
import { chordVoicings } from "~/model/chord-voicing";
import { ExerciseSettings } from "~/model/generate-exercise";

const baseSettings: Pick<
  ExerciseSettings,
  "voicing" | "rightHandOctaveDoubling" | "leftHandOctaveDoubling" | "positions"
> = {
  leftHandOctaveDoubling: ["no"],
  rightHandOctaveDoubling: ["no"],
  positions: ["5th"],
  voicing: ["close"],
};

test("should work", () => {
  expect(chordVoicings("I", baseSettings)).toEqual([
    {
      lHand: ["1"],
      rHand: ["1", "3", "5"],
    },
  ]);

  expect(chordVoicings("I7", baseSettings)).toEqual([
    {
      lHand: ["1"],
      rHand: ["7", "1", "3", "5"],
    },
  ]);

  expect(
    chordVoicings("I7", {
      ...baseSettings,
      positions: ["7th"],
      // todo: add an option to "drop the bass" in this case (very common). In the future, we need to enable dropping other notes like 5th
    }),
  ).toEqual([
    {
      lHand: ["1"],
      rHand: ["1", "3", "5", "7"],
    },
  ]);
});
