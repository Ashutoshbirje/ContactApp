import { useState, useEffect } from "react";
import axios from "axios";
import { Link} from 'react-router-dom';

function View({ token }) {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [editingContactId, setEditingContactId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("/api/contacts/getContacts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched contacts:", response.data); // Debug log
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    if (token) {
      fetchContacts();
    }
  }, [token]);

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleAddContact = async (e) => {
    e.preventDefault();

    // Create a temporary contact with a unique ID for optimistic update
    const optimisticContact = {
      id: Date.now(), // Temporary ID
      ...newContact,
    };

    // Add the optimistic contact immediately
    setContacts((prevContacts) => [...prevContacts, optimisticContact]);

    try {
      const response = await axios.post("/api/contacts/addContact", newContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Added contact:", response.data); // Debug log

      // Update the optimistic contact with the actual response data
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === optimisticContact.id ? response.data : contact
        )
      );

      // Reset the newContact state
      setNewContact({ name: "", phone: "", email: "", address: "" });
    } catch (error) {
      console.error("Failed to add contact:", error);

      // Optionally, remove the optimistic contact on failure
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== optimisticContact.id)
      );
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`/api/contacts/deleteContact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/contacts/updateContact/${editingContactId}`,
        newContact,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === editingContactId
            ? { ...contact, ...newContact }
            : contact
        )
      );
      setEditingContactId(null);
      setNewContact({ name: "", phone: "", email: "", address: "" });
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.id);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
    });
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Contacts</h2>

        <div className="bg-white shadow-md rounded-lg p-6">
          <ul>
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className="border-b border-gray-200 py-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-gray-600">{contact.phone}</p>
                  <p className="text-gray-600">{contact.email}</p>
                  <p className="text-gray-600">{contact.address}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>
  );
}

export default View;
