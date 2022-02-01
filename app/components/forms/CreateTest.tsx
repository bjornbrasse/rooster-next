import * as React from 'react';
import { useSubmit } from 'remix';

const CreateTestForm = () => {
  const submit = useSubmit();

  return (
    <div>
      <form method="POST" action="/tests/create">
        <label htmlFor="title">Naam</label>
        <input type="text" name="title" id="title" />
        <button className="btn">Maak aan</button>
      </form>
    </div>
  );
};

export default CreateTestForm;
