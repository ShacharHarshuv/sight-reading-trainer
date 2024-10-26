import { Pagination } from "solid-bootstrap";
import { JSXElement } from "solid-js";

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

  if (!Array.isArray(props.options[0])) {
    props.options = [props.options as T[]];
  }

  return (
    <div>
      {(props.options as T[][]).map((options) => (
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
