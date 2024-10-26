import { AbcPitch } from "~/model/abc-pitch";
import {
  NaturalPitchNumber,
  abcPitchToNaturalPitchNumber,
} from "~/model/natural-pitch-number";

export type NaturalRange = readonly [NaturalPitchNumber, NaturalPitchNumber];

export function naturalRange(
  min: AbcPitch | number,
  max: AbcPitch | number,
): NaturalRange {
  const minNumber =
    typeof min === "number" ? min : abcPitchToNaturalPitchNumber(min);
  const maxNumber =
    typeof max === "number" ? max : abcPitchToNaturalPitchNumber(max);

  if (minNumber > maxNumber) {
    console.warn("min > max", { min, max });
    return [maxNumber, minNumber];
  }

  return [minNumber, maxNumber];
}

export function intersectNaturalRanges(
  ...ranges: NaturalRange[]
): NaturalRange {
  return [
    Math.max(...ranges.map((range) => range[0])),
    Math.min(...ranges.map((range) => range[1])),
  ];
}

export function unionNaturalRanges(...ranges: NaturalRange[]): NaturalRange {
  return [
    Math.min(...ranges.map((range) => range[0])),
    Math.max(...ranges.map((range) => range[1])),
  ];
}

export function naturalRangeFrom(
  target: AbcPitch,
  distance: number,
): NaturalRange {
  const targetNumber = abcPitchToNaturalPitchNumber(target);
  return [targetNumber - distance, targetNumber + distance];
}

export function allNaturalPitchNumbersInRange(range: NaturalRange) {
  if (range[0] === -Infinity || range[1] === Infinity) {
    throw new Error(
      `Cannot generate all natural pitch numbers in infinite range ${range}`,
    );
  }
  const [min, max] = range;
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }
  return numbers;
}

export function isInNaturalRange(
  range: NaturalRange,
  pitch: AbcPitch,
): boolean {
  const number = abcPitchToNaturalPitchNumber(pitch);
  const [min, max] = range;
  return number >= min && number <= max;
}
