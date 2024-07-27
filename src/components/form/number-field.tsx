import { Form } from "solid-bootstrap";
import { createSignal } from "solid-js";

function toNumber(value: string) {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

export function NumberField(props: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  offset?: number;
}) {
  const isInRange = (value: number) => {
    if (props.min !== undefined && value < props.min) {
      return false;
    }
    if (props.max !== undefined && value > props.max) {
      return false;
    }
    return true;
  };

  const [isInvalid, setIsInvalid] = createSignal(false);

  return (
    <Form.Control
      type="number"
      min={props.min}
      max={props.max}
      value={props.value + (props.offset || 0)}
      onChange={(e) => {
        const maybeNumber = toNumber(e.target.value);
        setIsInvalid(!maybeNumber || !isInRange(maybeNumber));
      }}
      isInvalid={isInvalid()}
      onInput={(e) => {
        const maybeNumber = toNumber(e.target.value);
        if (!maybeNumber || !isInRange(maybeNumber)) {
          return;
        }

        props.onChange(maybeNumber - (props.offset || 0));
      }}
    />
  );
}
