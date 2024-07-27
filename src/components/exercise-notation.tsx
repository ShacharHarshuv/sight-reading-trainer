import { chunk } from "lodash";
import { createMemo } from "solid-js";
import Notation from "~/components/notation";
import { ExerciseSettings, generateExercise } from "~/model/generate-exercise";
import { NaturalRange, naturalRange } from "~/model/natural-range";
import { scaleDegreeToAbcPitches } from "~/model/scale-degree-to-abc";

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

      const tonicNotes = scaleDegreeToAbcPitches(
        "1",
        props.exerciseSettings.tonic,
        range,
      );
      return `[${tonicNotes.join("")}]8 || `;
    }

    return {
      rightHand: createTonicNotesIndicationNotation(
        props.exerciseSettings.rhRange,
      ),
      leftHand: createTonicNotesIndicationNotation(naturalRange("C,,", "E")),
    };
  }, [props.exerciseSettings.tonic, props.showTonicIndication]);

  const notation = createMemo(() => {
    return `
X:1
K: ${props.exerciseSettings.tonic}
M: 4/4
%%staves {1 2}
V:1 clef=treble
V:2 clef=bass
[V:1] ${tonicNotesIndicationNotation().rightHand}${systems()
      .map((system) =>
        system.map((segment, index) => `[${segment.join("")}]8`).join("|"),
      )
      .join("|\n")} |]
[V:2] ${tonicNotesIndicationNotation().leftHand}${systems()
      .map((system) => system.map(() => "z8").join("|"))
      .join("|\n")} |]
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
