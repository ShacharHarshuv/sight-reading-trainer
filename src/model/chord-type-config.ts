import { ChordType } from "~/model/roman-numeral-chord";

export interface ChordTypeConfig {
  numberOfNotes: number;
  bassIndex: number;
}

function _getPartialChordTypeConfig(
  chordType: ChordType,
): Partial<ChordTypeConfig> {
  switch (chordType) {
    case "":
      return {};
    case "6":
      return {
        bassIndex: 1,
      };
    case "64":
      return {
        bassIndex: 2,
      };
    case "7":
      return {
        numberOfNotes: 4,
      };
    default:
      chordType satisfies never;
      throw new Error(`Invalid chord type ${chordType}`);
  }
}

export function getChordTypeConfig(chordType: ChordType): ChordTypeConfig {
  return {
    numberOfNotes: 3,
    bassIndex: 0,
    ..._getPartialChordTypeConfig(chordType),
  };
}
