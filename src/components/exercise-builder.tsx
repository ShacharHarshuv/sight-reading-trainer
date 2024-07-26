import { createForm } from "@modular-forms/solid";
import { Button, Form } from "solid-bootstrap";

type LoginForm = {
  email: string;
  password: string;
};

export default function ExerciseBuilder() {
  const [loginForm, Login] = createForm<LoginForm>();
  const { Field } = Login;

  return (
    <>
      Form Test:
      <Login.Form
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Field name="email">
          {(field, props) => (
            <Form.Group class="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                {...props}
                type="email"
                placeholder="name@example.com"
              />
            </Form.Group>
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <Form.Group class="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...props}
                type="password"
                placeholder="name@example.com"
              />
            </Form.Group>
          )}
        </Field>
        <Button type="submit">Generate</Button>
      </Login.Form>
    </>
  );
}
