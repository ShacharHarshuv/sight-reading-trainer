import { chunk, isEmpty } from "lodash";
import { createMemo } from "solid-js";
import Notation from "~/components/notation";
import {
  ExerciseSettings,
  generateExercise,
  LEFT_HAND_INDEX,
  RIGHT_HAND_INDEX,
} from "~/model/generate-exercise";
import { NaturalRange } from "~/model/natural-range";
import { scaleDegreesToAbcPitchesOptions } from "~/model/scale-degrees-to-abc-pitches-options";

export default function ExerciseNotation(props: {
  exerciseSettings: ExerciseSettings;
  seed: number;
  showTonicIndication: boolean;
}) {
  const exercise = createMemo(() => {
    props.seed;
    return generateExercise(props.exerciseSettings);
  });

  const segmentsPerSystem = 8;
  const systems = createMemo(() => chunk(exercise(), segmentsPerSystem));

  const tonicNotesIndicationNotation = createMemo(() => {
    function createTonicNotesIndicationNotation(range: NaturalRange) {
      if (!props.showTonicIndication) {
        return "";
      }

      const tonicNotes = scaleDegreesToAbcPitchesOptions(
        "1",
        props.exerciseSettings.tonic,
        range,
      );
      return `[${tonicNotes.join("")}]8 || `;
    }

    return [
      createTonicNotesIndicationNotation(props.exerciseSettings.rhRange),
      createTonicNotesIndicationNotation(props.exerciseSettings.lhRange),
    ];
  }, [props.exerciseSettings.tonic, props.showTonicIndication]);

  function getNotationFor(
    handIndex: typeof RIGHT_HAND_INDEX | typeof LEFT_HAND_INDEX,
  ) {
    return `${tonicNotesIndicationNotation()[handIndex]}${systems()
      .map((system) =>
        system
          .map((segment, index) => {
            const notes = segment[handIndex];
            const notation = isEmpty(notes) ? "z" : `[${notes.join("")}]`;

            return `${notation}8`;
          })
          .join("|"),
      )
      .join("|\n")}`;
  }

  const notation = createMemo(() => {
    return `
X:1
K: ${props.exerciseSettings.tonic}
M: 4/4
%%staves {1 2}
V:1 clef=treble
V:2 clef=bass
[V:1] ${getNotationFor(RIGHT_HAND_INDEX)} |]
[V:2] ${getNotationFor(LEFT_HAND_INDEX)} |]
  `;
  });

  return (
    <>
      <Notation
        notation={notation()}
        options={{
          selectTypes: false,
        }}
      />
      <pre>{notation()}</pre>
    </>
  );
}
