import { Container } from "solid-bootstrap";
import { FiChevronUp } from "solid-icons/fi";
import { FontAwesomeIcon } from 'solid-fontawesome';
import { Icon } from "solid-heroicons";
import { arrowLeft } from "solid-heroicons/solid";
import ExerciseBuilder from '~/components/exercise-builder';

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
