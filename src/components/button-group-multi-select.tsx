import { Pagination } from "solid-bootstrap";

export function ButtonGroupMultiSelect<T extends string>(props: {
  options: readonly T[];
  value: readonly T[];
  onChange: (value: T[]) => void;
}) {
  function toggleOption(option: T) {
    if (props.value.includes(option)) {
      props.onChange(props.value.filter((v) => v !== option));
    } else {
      props.onChange([...props.value, option]);
    }
  }

  return (
    <Pagination>
      {props.options.map((option) => (
        <Pagination.Item
          active={props.value.includes(option)}
          onClick={() => toggleOption(option)}
        >
          {option}
        </Pagination.Item>
      ))}
    </Pagination>
  );
}
