import { Pagination } from "solid-bootstrap";

export function ButtonGroupSelect<T extends string>(props: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <Pagination>
      {props.options.map((option) => (
        <Pagination.Item
          active={option === props.value}
          onClick={() => props.onChange(option)}
        >
          {option}
        </Pagination.Item>
      ))}
    </Pagination>
  );
}
