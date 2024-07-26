import { Container } from "solid-bootstrap";
import ExerciseBuilder from "~/components/exercise-builder";

export default function Home() {
  return (
    <main>
      <Container>
        <h1>Sight Reading Trainer</h1>
        <ExerciseBuilder />
      </Container>
    </main>
  );
}
