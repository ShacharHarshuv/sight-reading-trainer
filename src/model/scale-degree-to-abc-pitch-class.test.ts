import { expect, test } from "vitest";
import { scaleDegreeToAbcNaturalPitchClass } from "./scale-degree-to-abc-natural-pitch-class";

test("should work", () => {
  expect(scaleDegreeToAbcNaturalPitchClass("1", "C")).toBe("C");
  expect(scaleDegreeToAbcNaturalPitchClass("2", "C")).toBe("D");
  expect(scaleDegreeToAbcNaturalPitchClass("3", "Eb")).toBe("G");
  expect(scaleDegreeToAbcNaturalPitchClass("4", "F")).toBe("B");
});
