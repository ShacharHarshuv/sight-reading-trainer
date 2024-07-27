import { AbcPitch } from "~/model/abc-pitch";
import {
  NaturalPitchClassNumber,
  abcPitchToNaturalPitchClassNumber,
} from "~/model/natural-pitch-class-number";

export type NaturalRange = [NaturalPitchClassNumber, NaturalPitchClassNumber];

export function naturalRange(
  min: AbcPitch | number,
  max: AbcPitch | number,
): NaturalRange {
  const minNumber =
    typeof min === "number" ? min : abcPitchToNaturalPitchClassNumber(min);
  const maxNumber =
    typeof max === "number" ? max : abcPitchToNaturalPitchClassNumber(max);

  if (minNumber > maxNumber) {
    console.warn("min > max", { min, max });
    return [maxNumber, minNumber];
  }

  return [minNumber, maxNumber];
}

export function mergeNaturalRanges(...ranges: NaturalRange[]): NaturalRange {
  return [
    Math.max(...ranges.map((range) => range[0])),
    Math.min(...ranges.map((range) => range[1])),
  ];
}

export function naturalRangeFrom(
  target: AbcPitch,
  distance: number,
): NaturalRange {
  const targetNumber = abcPitchToNaturalPitchClassNumber(target);
  return [targetNumber - distance, targetNumber + distance];
}

export function allNaturalPitchClassNumbersInRange(range: NaturalRange) {
  const [min, max] = range;
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }
  return numbers;
}
