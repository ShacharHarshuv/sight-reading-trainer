import { clientOnly } from "@solidjs/start";
import { createForm } from "@tanstack/solid-form";
import { Button, Col, Form, Row } from "solid-bootstrap";
import { createSignal } from "solid-js";
import { ButtonGroupMultiSelect } from "~/components/form/button-group-multi-select";
import { ButtonGroupSelect } from "~/components/form/button-group-select";
import { NumberField } from "~/components/form/number-field";
import { defaultSettings } from "~/model/default-settings";
import { scaleDegreesOptions } from "~/model/options";
import { pitchClasses } from "~/model/pitch-class";

const ExerciseNotation = clientOnly(() => import("./exercise-notation"));

export default function ExerciseBuilder() {
  const form = createForm(() => ({
    defaultValues: defaultSettings,
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log("submit", value);
    },
  }));
  const [seed, setSeed] = createSignal(1);
  const [showTonicIndication, setShowTonicIndication] = createSignal(false);

  const exerciseSettings = form.useStore((state) => state.values);
  const canSubmit = form.useStore((state) => state.canSubmit);

  return (
    <div>
      <Form.Group class="mb-3">
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
      <Form.Check
        class="mb-3"
        type="checkbox"
        id="showTonicIndication"
        label="Show Tonic Indication"
        checked={showTonicIndication()}
        onChange={(e) => setShowTonicIndication(e.target.checked)}
      />
      <Form.Group class="mb-3" controlId="formBasicEmail">
        <Form.Label>Scale Degrees</Form.Label>
        <form.Field name="scaleDegrees">
          {(field) => (
            <ButtonGroupMultiSelect
              options={scaleDegreesOptions}
              value={field().state.value}
              onChange={(newValue) => field().handleChange(newValue)}
            />
          )}
        </form.Field>
      </Form.Group>
      <Row class="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Max Interval</Form.Label>
          <form.Field name="maxInterval">
            {(field) => (
              <>
                <NumberField
                  value={field().state.value}
                  min={2}
                  offset={1}
                  onChange={(newValue) => field().handleChange(newValue)}
                />
              </>
            )}
          </form.Field>
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>Max Range</Form.Label>
          <form.Field name="maxOverallRange">
            {(field) => (
              <>
                <NumberField
                  value={field().state.value}
                  min={2}
                  offset={1}
                  onChange={(newValue) => field().handleChange(newValue)}
                />
              </>
            )}
          </form.Field>
        </Form.Group>
      </Row>
      <Button disabled={!canSubmit()} onClick={() => setSeed((seed) => ++seed)}>
        Generate
      </Button>
      <ExerciseNotation
        showTonicIndication={showTonicIndication()}
        exerciseSettings={exerciseSettings()}
        seed={seed()}
      />
    </div>
  );
}
