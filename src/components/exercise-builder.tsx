import { createForm } from "@tanstack/solid-form";
import { Form } from "solid-bootstrap";

function toNumber(value: string) {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

export default function ExerciseBuilder() {
  const form = createForm(() => ({
    defaultValues: {
      name: "",
      age: undefined as number | undefined,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log("submit", value);
    },
  }));

  const canSubmit = form.useStore((state) => state.canSubmit);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <Form.Group class="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().setValue(e.currentTarget.value)}
                />
              </Form.Group>
            )}
          </form.Field>
          <form.Field
            name="age"
            validators={{
              onChange: ({ value }) =>
                value === undefined ? "Age is required" : undefined,
            }}
          >
            {(field) => (
              <Form.Group class="mb-3" controlId="formBasicEmail">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) =>
                    field().setValue(toNumber(e.currentTarget.value))
                  }
                />
                {field().state.meta.errors ? (
                  <em role="alert">{field().state.meta.errors.join(", ")}</em>
                ) : null}
              </Form.Group>
            )}
          </form.Field>
        </div>
        <button disabled={!canSubmit()} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
