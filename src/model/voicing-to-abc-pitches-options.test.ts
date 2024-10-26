import { describe, expect, test } from "vitest";
import { naturalRange } from "~/model/natural-range";
import { scaleDegreeVoicingToAbcPitchesOptions } from "~/model/voicing-to-abc-pitches-options";

describe("pitchClassVoicingToAbcPitchesOptions", () => {
  test("single right hand", () => {
    expect(
      scaleDegreeVoicingToAbcPitchesOptions(
        {
          rHand: ["3"],
          lHand: [],
        },
        {
          key: "G",
          sopranoRange: naturalRange("G,", "G''"),
          rHandRange: naturalRange("C", "C''"),
          lHandRange: naturalRange("C,,", "E"),
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
          lHand: ["3"],
        },
        {
          key: "G",
          sopranoRange: naturalRange("G,,,", "G"),
          rHandRange: naturalRange("C", "C''"),
          lHandRange: naturalRange("C,,", "E"),
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
