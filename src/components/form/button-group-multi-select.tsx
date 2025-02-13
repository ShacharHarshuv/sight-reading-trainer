import { Pagination } from "solid-bootstrap";
import { JSXElement, createMemo } from "solid-js";

export function ButtonGroupMultiSelect<T extends string>(props: {
  options: readonly T[] | T[][];
  value: readonly T[];
  getView?: (option: T) => JSXElement;
  onChange: (value: T[]) => void;
}) {
  function toggleOption(option: T) {
    if (props.value.includes(option)) {
      props.onChange(props.value.filter((v) => v !== option));
    } else {
      props.onChange([...props.value, option]);
    }
  }

  const normalizedOptions = createMemo(() => {
    if (!Array.isArray(props.options[0])) {
      return [props.options as T[]];
    }

    return props.options as T[][];
  });

  return (
    <div>
      {normalizedOptions().map((options) => (
        <Pagination>
          {options.map((option) => (
            <Pagination.Item
              active={props.value.includes(option)}
              onClick={() => toggleOption(option)}
            >
              {props.getView ? props.getView(option) : option}
            </Pagination.Item>
          ))}
        </Pagination>
      ))}
    </div>
  );
}
