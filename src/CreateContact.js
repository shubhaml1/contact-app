// import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import ImageInput from "./ImageInput";
import serializeForm from "form-serialize";

const CreateContact = ({ onCreateContact }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = serializeForm(e.target, { hash: true });
    const newContact = values;
    if (onCreateContact) {
      onCreateContact(newContact);
      navigate("/");
    }
  };

  return (
    <div>
      <Link className="close-create-contact" to="/">
        Close
      </Link>
      <form onSubmit={handleSubmit} className="create-contact-form">
        <ImageInput
          className="create-contact-avatar-input"
          name="avatarURL"
          maxHeight={64}
       
        />
        <div className="create-contact-details">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="handle"
            placeholder="Handle"
            required
          />
          <button>Add Contact</button>
        </div>
      </form>
    </div>
  );
};

CreateContact.propTypes = {
  onCreateContact: PropTypes.func.isRequired,
};

export default CreateContact;
