import { RomanNumeralChord } from "~/model/roman-numeral-chord";

const regex =
  /^(?<accidental>[#b]?)(?<numeral>[IViv]+)(?<postfix>[o\+]?)(?<numbers>\d*)$/;

const romanNumeralUnicode: { [key: string]: string } = {
  I: "Ⅰ",
  II: "Ⅱ",
  III: "Ⅲ",
  IV: "Ⅳ",
  V: "Ⅴ",
  VI: "Ⅵ",
  VII: "Ⅶ",
  i: "ⅰ",
  ii: "ⅱ",
  iii: "ⅲ",
  iv: "ⅳ",
  v: "ⅴ",
  vi: "ⅵ",
  vii: "ⅶ",
};

const accidentalSymbols: { [key: string]: string } = {
  "#": "♯",
  b: "♭",
};

export function formatChord(chord: RomanNumeralChord) {
  if (typeof chord !== "string") {
    throw new Error(`Could not parse ${chord}`);
  }
  const { accidental, numeral, postfix, numbers } = chord.match(regex)!.groups!;

  return (
    <span>
      {accidental && <span>{accidentalSymbols[accidental] || accidental}</span>}
      <span>{romanNumeralUnicode[numeral] || numeral}</span>
      {postfix && <sup>{postfix}</sup>}
      <span
        style={{
          display: "inline-block",
          "line-height": "0.9em",
          "font-size": "80%",
          "vertical-align": numbers.length > 1 ? "-0.7em" : "inherit",
          width: "0.4em",
        }}
      >
        <sup style={{ "vertical-align": "baseline" }}>{numbers[0]}</sup>
        <br />
        <sup style={{ "vertical-align": "baseline" }}>{numbers[1] ?? ""}</sup>
      </span>
    </span>
  );
}
