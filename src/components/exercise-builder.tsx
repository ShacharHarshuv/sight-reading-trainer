import { clientOnly } from "@solidjs/start";
import { createForm } from "@tanstack/solid-form";
import { Button, Form } from "solid-bootstrap";
import { createSignal } from "solid-js";
import { ButtonGroupSelect } from "~/components/button-group-select";
import { defaultSettings } from "~/model/default-settings";
import { pitchClasses } from "~/model/pitch-class";

const ExerciseNotation = clientOnly(() => import("./exercise-notation"));

function toNumber(value: string) {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

export default function ExerciseBuilder() {
  const form = createForm(() => ({
    defaultValues: defaultSettings,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log("submit", value);
    },
  }));
  const [seed, setSeed] = createSignal(1);

  const exerciseSettings = form.useStore((state) => state.values);

  const canSubmit = form.useStore((state) => state.canSubmit);

  return (
    <div>
      <Form.Group class="mb-3" controlId="formBasicEmail">
        <Form.Label>Key</Form.Label>
        <form.Field name="tonic">
          {(field) => (
            <ButtonGroupSelect
              options={pitchClasses}
              value={field().state.value}
              onChange={(newValue) => field().handleChange(newValue)}
            />
          )}
        </form.Field>
      </Form.Group>
      <Button disabled={!canSubmit()} onClick={() => setSeed((seed) => ++seed)}>
        Generate
      </Button>
      <ExerciseNotation
        showTonicIndication={false}
        exerciseSettings={exerciseSettings()}
        seed={seed()}
      />
    </div>
  );
}
