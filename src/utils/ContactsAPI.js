const api = process.env.REACT_APP_CONTACTS_API_URL || "http://localhost:3000/contact-app";
console.log(api);
let token = localStorage.token;
if (!token) token = localStorage.token = Math.random().toString(36).substr(-8);

const headers = {
  Accept: "application/json",
  Authorization: token,
};

let contacts = [
  {
    id: "karen",
    name: "Karen Isgrigg",
    handle: "karen_isgrigg",
    avatarURL: "/contact-app/avatars/karen.jpg"
  },
  {
    id: "richard",
    name: "Richard Kalehoff",
    handle: "richardkalehoff",
    avatarURL: "/contact-app/avatars/richard.jpg"
  },
  {
    id: "tyler",
    name: "Tyler McGinnis",
    handle: "tylermcginnis",
    avatarURL: "/contact-app/avatars/tyler.jpg"
  }
];

export const getAll_fetch = () =>
  fetch(`${api}/contacts`, { headers })
    .then((res) => res.json())
    .then((data) => data.contacts);

export const getAllContacts = () =>
  new Promise((resolve, reject) => {
    return resolve(contacts);
  });

export const remove_fetch = (contact) =>
  fetch(`${api}/contacts/${contact.id}`, { method: "DELETE", headers })
    .then((res) => res.json())
    .then((data) => data.contact);

export const remove = (contact) =>
  new Promise((resolve, reject) => resolve(contact));
// new Promise((resolve, reject) => reject());

export const create_fetch = (body) =>
  fetch(`${api}/contacts`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const create = (contact) =>
  new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substr(-8);
    contact.id = id;
    resolve(contact);
  });
