import { clientOnly } from "@solidjs/start";
import { createForm } from "@tanstack/solid-form";
import { Button, ButtonGroup, Col, Form, Row, Stack } from "solid-bootstrap";
import {
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from "solid-js";
import { ButtonGroupMultiSelect } from "~/components/form/button-group-multi-select";
import { ButtonGroupSelect } from "~/components/form/button-group-select";
import { NumberField } from "~/components/form/number-field";
import { RangePicker } from "~/components/form/range-picker";
import { getChordTypeConfig } from "~/model/chord-type-config";
import { defaultSettings } from "~/model/default-settings";
import { formatChord } from "~/model/format-chord";
import { ExerciseSettings, VoicingPosition } from "~/model/generate-exercise";
import { NaturalRange } from "~/model/natural-range";
import { chordsOptions, scaleDegreesOptions } from "~/model/options";
import { parseChord } from "~/model/parse-chord";
import { pitchClasses } from "~/model/pitch-class";

const ExerciseNotation = clientOnly(() => import("./exercise-notation"));

export default function ExerciseBuilder() {
  const form = createForm(() => {
    return {
      defaultValues: defaultSettings,
      onSubmit: async ({ value }) => {},
    };
  });
  const [seed, setSeed] = createSignal(1);
  const [showTonicIndication, setShowTonicIndication] = createSignal(false);

  const exerciseSettings = form.useStore((state) => state.values);
  const selectedChords = createMemo(() => exerciseSettings().chords);
  const isChordsSelected = createMemo(() => !!selectedChords().length);
  const relevantPositions = createMemo((): VoicingPosition[] => {
    const triadPositions: VoicingPosition[] = ["5th", "8th", "3rd"];
    // consider creating a smarter check as we add more extensions
    if (
      selectedChords().some(
        (chord) => getChordTypeConfig(parseChord(chord).type).numberOfNotes > 3,
      )
    ) {
      return ["7th", ...triadPositions];
    } else {
      return triadPositions;
    }
  });
  const canSubmit = form.useStore((state) => state.canSubmit);
  const defaultRhRange: NaturalRange = [...defaultSettings.rhRange]; // for some reason defaultSettings is being overridden, though it really shouldn't
  const defaultLhRange: NaturalRange = [...defaultSettings.lhRange]; // for some reason defaultSettings is being overridden, though it really shouldn't
  const selectedHand = form.useStore((state) => state.values.hand);

  onMount(() => {
    const savedSettingsValue = localStorage.getItem("exerciseSettings");

    if (!savedSettingsValue) {
      return;
    }

    const savedSettings = JSON.parse(savedSettingsValue) as ExerciseSettings;
    console.log("loaded settings", savedSettings);

    form.update({
      defaultValues: {
        ...defaultSettings,
        ...savedSettings,
      },
    });
    form.handleSubmit();
  });

  createEffect(() => {
    console.log("saving exerciseSettings", exerciseSettings());
    localStorage.setItem(
      "exerciseSettings",
      JSON.stringify(exerciseSettings()),
    );
  });

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
        <Form.Group class="mb-3" controlId="formBasicEmail">
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
                    onClick={() => field().handleChange([])}
                  >
                    None
                  </Button>
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
        <Form.Group class="mb-3">
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
      <Stack class="mb-3" direction="horizontal" gap={3}>
        <Form.Group class="mb-3" controlId="formBasicEmail">
          <Form.Label>Chords</Form.Label>
          <form.Field name="chords">
            {(field) => (
              <ButtonGroupMultiSelect
                options={chordsOptions}
                value={field().state.value}
                onChange={(newValue) => {
                  field().handleChange(newValue);
                  if (
                    exerciseSettings().positions.filter((position) =>
                      relevantPositions().includes(position),
                    ).length === 0
                  ) {
                    form.setFieldValue(
                      "positions",
                      (prev) => [...prev, "5th"] as const,
                    );
                  }
                }}
                getView={formatChord}
              />
            )}
          </form.Field>
        </Form.Group>
        {isChordsSelected() && (
          <>
            <Form.Group class="mb-3">
              <Form.Label>Positions</Form.Label>
              <form.Field name="positions">
                {(field) => (
                  <ButtonGroupMultiSelect
                    options={relevantPositions()}
                    value={field().state.value}
                    onChange={(newValue, lastChanged) => {
                      console.log("new value", newValue);
                      if (
                        newValue.filter((position) =>
                          relevantPositions().includes(position),
                        ).length === 0
                      ) {
                        newValue.push(lastChanged);
                      }

                      field().handleChange(newValue);
                    }}
                    getView={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                )}
              </form.Field>
            </Form.Group>
            <Form.Group class="mb-3">
              <Form.Label>Voicings</Form.Label>
              <form.Field name="voicing">
                {(field) => (
                  <ButtonGroupMultiSelect
                    options={["close", "open"]}
                    value={field().state.value}
                    onChange={(newValue, lastChanged) => {
                      if (newValue.length === 0) {
                        newValue =
                          lastChanged === "close" ? ["open"] : ["close"];
                      }

                      field().handleChange(newValue);
                    }}
                    getView={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                )}
              </form.Field>
              <Form.Label>Double Bass</Form.Label>
              <form.Field name="bassDoubling">
                {(field) => (
                  <ButtonGroupMultiSelect
                    options={["no", "only triads", "yes"]}
                    value={field().state.value}
                    onChange={(newValue, lastChanged) => {
                      if (newValue.length === 0) {
                        newValue =
                          lastChanged === "no" ? ["only triads"] : ["no"];
                      }

                      if (
                        lastChanged === "only triads" &&
                        newValue.includes("only triads") &&
                        newValue.includes("yes")
                      ) {
                        newValue = newValue.filter((v) => v !== "yes");
                      }
                      if (
                        lastChanged === "yes" &&
                        newValue.includes("only triads") &&
                        newValue.includes("yes")
                      ) {
                        newValue = newValue.filter((v) => v !== "only triads");
                      }

                      field().handleChange(newValue);
                    }}
                    getView={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    }
                  />
                )}
              </form.Field>
            </Form.Group>
            <Form.Group class="mb-3">
              <Form.Label>Octave Doubling</Form.Label>
              <Stack direction="horizontal" gap={3}>
                <Form.Group class="mb-3">
                  <Form.Label>Left Hand</Form.Label>
                  <form.Field name="leftHandOctaveDoubling">
                    {(field) => (
                      <ButtonGroupMultiSelect
                        options={["yes", "no"]}
                        value={field().state.value}
                        onChange={(newValue, lastChanged) => {
                          if (newValue.length === 0) {
                            newValue = lastChanged === "yes" ? ["no"] : ["yes"];
                          }
                          field().handleChange(newValue);
                        }}
                        getView={(value) =>
                          value.charAt(0).toUpperCase() + value.slice(1)
                        }
                      />
                    )}
                  </form.Field>
                </Form.Group>
                <Form.Group class="mb-3">
                  <Form.Label>Right Hand</Form.Label>
                  <form.Field name="rightHandOctaveDoubling">
                    {(field) => (
                      <ButtonGroupMultiSelect
                        options={["yes", "no"]}
                        value={field().state.value}
                        onChange={(newValue, lastChanged) => {
                          if (newValue.length === 0) {
                            newValue = lastChanged === "yes" ? ["no"] : ["yes"];
                          }
                          field().handleChange(newValue);
                        }}
                        getView={(value) =>
                          value.charAt(0).toUpperCase() + value.slice(1)
                        }
                      />
                    )}
                  </form.Field>
                </Form.Group>
              </Stack>
            </Form.Group>
          </>
        )}
      </Stack>
      <Row class="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Max Melodic Interval</Form.Label>
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
          <Form.Label>Max Bass Interval</Form.Label>
          <form.Field name="maxBassInterval">
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
          <Show
            when={selectedHand() === "right"}
            children={
              <form.Field name="rhRange">
                {(field) => (
                  <>
                    <Form.Label>
                      Range
                      <Button
                        variant="link"
                        onClick={() => field().handleChange(defaultRhRange)}
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
            }
            fallback={
              <form.Field name="lhRange">
                {(field) => (
                  <>
                    <Form.Label>
                      Range
                      <Button
                        variant="link"
                        onClick={() => field().handleChange(defaultLhRange)}
                      >
                        reset
                      </Button>
                    </Form.Label>
                    <RangePicker
                      clef="bass"
                      value={field().state.value}
                      onChange={field().handleChange}
                    />
                  </>
                )}
              </form.Field>
            }
          />
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
