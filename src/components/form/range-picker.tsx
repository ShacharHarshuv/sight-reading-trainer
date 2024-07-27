import { Button, ButtonGroup, Stack } from "solid-bootstrap";
import { FaSolidChevronDown, FaSolidChevronUp } from "solid-icons/fa";
import { createMemo } from "solid-js";
import Notation from "~/components/notation";
import { naturalPitchClassNumberToAbcPitch } from "~/model/natural-pitch-class-number";
import { NaturalRange } from "~/model/natural-range";

export function RangePicker(props: {
  clef?: "bass" | "treble";
  value: NaturalRange;
  onChange: (value: NaturalRange) => void;
}) {
  const notes = createMemo(() =>
    props.value.map(naturalPitchClassNumberToAbcPitch),
  );
  const clef = createMemo(() => props.clef ?? "treble");
  const notation = createMemo(() => {
    return `V: 1 clef=${clef()}\n` + `[${notes().join("")}]8`;
  });

  const bottom = () => props.value[0];
  const top = () => props.value[1];

  const buttons = (difference: NaturalRange) => {
    const [bottomDiff, topDiff] = difference;

    return (
      <ButtonGroup size="sm" class="mb-3">
        <Button
          variant="light"
          onClick={() =>
            props.onChange([bottom() + bottomDiff, top() + topDiff])
          }
        >
          <FaSolidChevronUp />
        </Button>
        <Button
          variant="light"
          onClick={() =>
            props.onChange([bottom() - bottomDiff, top() - topDiff])
          }
        >
          <FaSolidChevronDown />
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <>
      <Stack direction="horizontal">
        <div style="width: 70px">
          <Stack>
            {buttons([0, 1])}
            {buttons([1, 0])}
          </Stack>
        </div>
        <div style="height: 100px; position: relative; top: -12px">
          <Notation
            notation={notation()}
            options={{
              staffwidth: 70,
            }}
          />
        </div>
      </Stack>
    </>
  );
}
