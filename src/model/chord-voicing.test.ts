import { describe, expect, test } from "vitest";
import { chordVoicings } from "~/model/chord-voicing";

const baseSettings: Parameters<typeof chordVoicings>[1] = {
  leftHandOctaveDoubling: ["no"],
  rightHandOctaveDoubling: ["no"],
  positions: ["5th"],
  voicing: ["close"],
  bassDoubling: ["only triads"],
};

describe("chord voicing", () => {
  test("basic triad", () => {
    expect(chordVoicings("I", baseSettings)).toEqual([
      {
        lHand: ["1"],
        rHand: ["1", "3", "5"],
      },
    ]);
  });

  test("triad w/o bass doubling", () => {
    expect(
      chordVoicings("I", {
        ...baseSettings,
        bassDoubling: ["no"],
      }),
    ).toEqual([
      {
        lHand: ["1"],
        rHand: ["3", "5"],
      },
    ]);
  });

  test("diatonic 7th chord", () => {
    expect(chordVoicings("I7", baseSettings)).toEqual([
      {
        lHand: ["1"],
        rHand: ["7", "3", "5"],
      },
    ]);
  });

  test("diatonic 7th chord in 7th position", () => {
    expect(
      chordVoicings("I7", {
        ...baseSettings,
        positions: ["7th"],
      }),
    ).toEqual([
      {
        lHand: ["1"],
        rHand: ["3", "5", "7"],
      },
    ]);
  });

  test("diatonic 7th chord with bass doubling", () => {
    expect(
      chordVoicings("I7", {
        ...baseSettings,
        positions: ["7th"],
        bassDoubling: ["yes"],
      }),
    ).toEqual([
      {
        lHand: ["1"],
        rHand: ["1", "3", "5", "7"],
      },
    ]);
  });
});
