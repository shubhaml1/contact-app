import React, { useState, useEffect } from "react";
import ListContacts from "./ListContacts";
import * as ContactsAPI from "./utils/ContactsAPI";
import CreateContact from "./CreateContact";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  let dbContacts;
  ContactsAPI.getAllContacts().then((contacts) => {
      dbContacts = contacts;
  });

  const [contacts, setContacts] = useState(
    () => { const savedContact = localStorage.getItem('savedContact');
    return savedContact !== null ? JSON.parse(savedContact):dbContacts;
    });
console.log(dbContacts);

  useEffect(() => {
    localStorage.setItem('savedContact', JSON.stringify(contacts));
  }, [contacts]);

  // useEffect(() => {
  //   ContactsAPI.getAllContacts().then((contacts) => {
  //     setContacts(contacts);
  //   });
  // }, []);

  const removeContact = (contact) => {
    ContactsAPI.remove(contact)
      .then((removedContact) => {
        console.log("Contact removed:", removedContact);
        setContacts((prevContacts) =>
          prevContacts.filter((c) => c.id !== removedContact.id)
        );
        localStorage.setItem('savedScore', JSON.stringify(contacts))
      })
      .catch((error) => console.error("Error removing contact:", error));
  };
  
  const createContact = (contact) => {
    console.log(contact);
    ContactsAPI.create(contact).then((newContact) => {
      setContacts((prevContacts) => [...prevContacts, newContact]);
    });
  };

  return (
    <Router basename="/contact-app" >
      <Routes>
        <Route
          path="/"
          element={
            <ListContacts contacts={contacts} onDeleteContact={removeContact} />
          }
        />
        <Route
          path="/create"
          element={<CreateContact onCreateContact={createContact} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
