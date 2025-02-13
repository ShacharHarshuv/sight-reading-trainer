import { expect, test } from "vitest";
import { chordVoicings } from "~/model/chord-voicing";

test("should work", () => {
  expect(
    chordVoicings("I", {
      leftHandOctaveDoubling: ["no"],
      rightHandOctaveDoubling: ["no"],
      positions: ["5th"],
      voicing: ["close"],
    }),
  ).toEqual([
    {
      lHand: ["1"],
      rHand: ["1", "3", "5"],
    },
  ]);

  expect(
    chordVoicings("I7", {
      leftHandOctaveDoubling: ["no"],
      rightHandOctaveDoubling: ["no"],
      positions: ["5th"],
      voicing: ["close"],
    }),
  ).toEqual([
    {
      lHand: ["1"],
      rHand: ["7", "1", "3", "5"],
    },
  ]);

  expect(
    chordVoicings("I7", {
      leftHandOctaveDoubling: ["no"],
      rightHandOctaveDoubling: ["no"],
      positions: ["7th"],
      voicing: ["close"],
      // todo: add an option to "drop the bass" in this case (very common). In the future, we need to enable dropping other notes like 5th
    }),
  ).toEqual([
    {
      lHand: ["1"],
      rHand: ["1", "3", "5", "7"],
    },
  ]);
});
