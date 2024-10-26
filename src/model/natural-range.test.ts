import { expect, test } from "vitest";
import {
  allNaturalPitchNumbersInRange,
  naturalRange,
} from "~/model/natural-range";

test("allNaturalPitchNumbersInRange", () => {
  expect(allNaturalPitchNumbersInRange(naturalRange("A,", "C''"))).toEqual([
    -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
  ]);
});
