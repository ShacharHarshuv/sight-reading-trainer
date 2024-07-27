import { clientOnly } from "@solidjs/start";
import { createForm } from "@tanstack/solid-form";
import { Button, ButtonGroup, Col, Form, Row, Stack } from "solid-bootstrap";
import { createSignal } from "solid-js";
import { ButtonGroupMultiSelect } from "~/components/form/button-group-multi-select";
import { ButtonGroupSelect } from "~/components/form/button-group-select";
import { NumberField } from "~/components/form/number-field";
import { RangePicker } from "~/components/form/range-picker";
import { defaultSettings } from "~/model/default-settings";
import { NaturalRange } from "~/model/natural-range";
import { scaleDegreesOptions } from "~/model/options";
import { pitchClasses } from "~/model/pitch-class";

const ExerciseNotation = clientOnly(() => import("./exercise-notation"));

export default function ExerciseBuilder() {
  const form = createForm(() => ({
    defaultValues: defaultSettings, // todo?
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log("submit", value);
    },
  }));
  const [seed, setSeed] = createSignal(1);
  const [showTonicIndication, setShowTonicIndication] = createSignal(false);

  const exerciseSettings = form.useStore((state) => state.values);
  const canSubmit = form.useStore((state) => state.canSubmit);
  const defaultRange: NaturalRange = [...defaultSettings.range]; // for some reason defaultSettings is being overridden, though it really shouldn't

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
      <Stack class="mb-3" direction="horizontal" gap={3}>
        <Form.Group>
          <Form.Label>Scale Degrees</Form.Label>
          <form.Field name="scaleDegrees">
            {(field) => (
              <Stack direction="horizontal" gap={2}>
                <ButtonGroupMultiSelect
                  options={scaleDegreesOptions}
                  value={field().state.value}
                  onChange={(newValue) => field().handleChange(newValue)}
                />
                <ButtonGroup>
                  <Button
                    variant="outline-secondary"
                    onClick={() => field().handleChange(["1", "3", "5"])}
                  >
                    Triad
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onclick={() =>
                      field().handleChange(["1", "2", "3", "5", "6"])
                    }
                  >
                    Pentatonic
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onclick={() =>
                      field().handleChange(["1", "2", "3", "4", "5", "6", "7"])
                    }
                  >
                    All
                  </Button>
                </ButtonGroup>
              </Stack>
            )}
          </form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Label>Hand</Form.Label>
          <form.Field name="hand">
            {(field) => (
              <ButtonGroupSelect
                options={["left", "right"]}
                value={field().state.value}
                onChange={field().handleChange}
              />
            )}
          </form.Field>
        </Form.Group>
      </Stack>
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
        <Form.Group as={Col}>
          <form.Field name="range">
            {(field) => (
              <>
                <Form.Label>
                  Range
                  <Button
                    variant="link"
                    onClick={() => field().handleChange(defaultRange)}
                  >
                    reset
                  </Button>
                </Form.Label>
                <RangePicker
                  value={field().state.value}
                  onChange={field().handleChange}
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
