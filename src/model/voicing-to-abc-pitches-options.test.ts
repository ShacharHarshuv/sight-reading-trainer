import { describe, expect, test } from "vitest";
import { naturalRange } from "~/model/natural-range";
import { scaleDegreeVoicingToAbcPitchesOptions } from "~/model/voicing-to-abc-pitches-options";

describe("pitchClassVoicingToAbcPitchesOptions", () => {
  test("single right hand", () => {
    expect(
      scaleDegreeVoicingToAbcPitchesOptions(
        {
          rHand: ["3"],
          lHandUpperVoices: [],
          lHandBass: [],
        },
        {
          key: "G",
          sopranoRange: naturalRange("G,", "G''"),
          range: {
            rHand: naturalRange("C", "C''"),
            lHand: naturalRange("C,,", "E"),
          },
        },
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          rHand: ["B"],
          lHand: [],
        },
        {
          rHand: ["B'"],
          lHand: [],
        },
      ]),
    );
  });

  test("single left hand", () => {
    expect(
      scaleDegreeVoicingToAbcPitchesOptions(
        {
          rHand: [],
          lHandUpperVoices: ["3"],
          lHandBass: [],
        },
        {
          key: "G",
          sopranoRange: naturalRange("G,,,", "G"),
          range: {
            rHand: naturalRange("C", "C''"),
            lHand: naturalRange("C,,", "E"),
          },
        },
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          rHand: [],
          lHand: ["B,"],
        },
        {
          rHand: [],
          lHand: ["B,,"],
        },
      ]),
    );
  });
});
