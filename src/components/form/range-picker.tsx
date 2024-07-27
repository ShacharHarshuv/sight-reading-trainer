import {
  Button,
  ButtonGroup,
  Stack,
} from "solid-bootstrap";
import { createMemo } from "solid-js";
import { naturalPitchClassNumberToAbcPitch } from "~/model/natural-pitch-class-number";
import { NaturalRange } from "~/model/natural-range";
import { clientOnly } from '@solidjs/start';
import {
  FaSolidChevronDown,
  FaSolidChevronUp,
} from 'solid-icons/fa';

const Notation = clientOnly(() => import("~/components/notation"));

export function RangePicker(props: {
  value: NaturalRange;
  onChange: (value: NaturalRange) => void;
}) {
  const notes = createMemo(() =>
    props.value.map(naturalPitchClassNumberToAbcPitch),
  );
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
  }

  return (
    <>
      <Stack direction="horizontal" >
        <div style="width: 70px">
          <Stack>
            {buttons([0, 1])}
            {buttons([1, 0])}
          </Stack>
        </div>
        <div style="height: 100px; position: relative; top: -12px">
          <Notation
            notation={`[${notes().join("")}]8`}
            options={{
              staffwidth: 70,
            }}
          />
        </div>
      </Stack>
    </>
  );
}
