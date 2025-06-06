import { useState } from 'react';
import axios from 'axios';
import './AddUserForm.css';

const DEFAULT_FORM_VALUES = {
  email: '',
  firstname: '',
  lastname: '',
};

function AddUserForm({ onSuccessfulUserCreation }) {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [userCreationError, setUserCreationError] = useState(null);
  const [userCreationSuccess, setUserCreationSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayCreationSuccessMessage = () => {
    setUserCreationSuccess('New user created successfully');
    setTimeout(() => {
      setUserCreationSuccess(null);
    }, 3000);
  };

  const saveUser = (event) => {
    // This avoid default page reload behavior on form submit
    event.preventDefault();

    setUserCreationError(null);
    setIsSubmitting(true);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/new`, formValues)
      .then(() => {
        displayCreationSuccessMessage();
        setFormValues(DEFAULT_FORM_VALUES);
        onSuccessfulUserCreation();
      })
      .catch((error) => {
        setUserCreationError('An error occured while creating new user.');
        console.error(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleInputChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value });

    // Clear errors when user starts typing
    if (userCreationError) {
      setUserCreationError(null);
    }
  };

  return (
    <div>
      <form className="add-user-form" onSubmit={saveUser}>
        {/* Champ Email - pleine largeur */}
        <div className="form-group">
          <input
            className="add-user-input"
            required
            type="email"
            placeholder="Email"
            value={formValues.email}
            onChange={(event) => handleInputChange('email', event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Champs First Name et Last Name - côte à côte */}
        <div className="form-row">
          <div className="form-group">
            <input
              className="add-user-input"
              placeholder="First name"
              value={formValues.firstname}
              onChange={(event) =>
                handleInputChange('firstname', event.target.value)
              }
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="add-user-input"
              placeholder="Last name"
              value={formValues.lastname}
              onChange={(event) =>
                handleInputChange('lastname', event.target.value)
              }
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <button
          className="add-user-button"
          type="submit"
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Adding user...' : 'Add user'}
        </button>
      </form>

      {userCreationSuccess !== null && (
        <div className="user-creation-success">{userCreationSuccess}</div>
      )}
      {userCreationError !== null && (
        <div className="user-creation-error">{userCreationError}</div>
      )}
    </div>
  );
}

export default AddUserForm;
