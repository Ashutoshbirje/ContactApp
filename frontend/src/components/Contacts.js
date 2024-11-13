import { useState, useEffect } from "react";
import axios from "axios";

function Contacts({ token }) {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [editingContactId, setEditingContactId] = useState(null);
  const [showContacts, setShowContacts] = useState(false); // State to toggle contacts display

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

  const toggleContacts = () => {
    setShowContacts(!showContacts); // Toggle the display state
  };

  return (
    <div  className="container mx-auto mt-10">
      <div id="y7" className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          {editingContactId ? "Edit Contact" : "Add Contact"}
        </h2>

        <form onSubmit={editingContactId ? handleUpdateContact : handleAddContact}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Ashutosh Birje"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={newContact.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="9322323582"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={newContact.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="ashutoshbirje@gmail.com"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={newContact.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                placeholder="At/Post Vijaydurg"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={newContact.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500 transition"
            >
              {editingContactId ? "Update Contact" : "Add Contact"}
            </button>
          </div>
        </form>
      </div>

      {/* Button to toggle contacts display */}
      <div className="text-center mt-6">
        <button
          onClick={toggleContacts}
          className="bg-green-600 text-white px-4 py-4 mt-8 rounded-md hover:bg-green-500 transition"
        >
          {showContacts ? "Hide Contacts" : "Show Contacts"}
        </button>
      </div>

      {/* Conditional rendering for the contacts */}
      {showContacts && (
        <div className="mt-12 max-w-4xl mx-auto">
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
                      onClick={() => handleEditContact(contact)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400"
                    >
                      <a href="#y7">Edit</a>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;
