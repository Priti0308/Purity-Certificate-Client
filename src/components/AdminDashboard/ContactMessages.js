import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("/contact");
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`/contact/${id}`); 
      setMessages((prev) => prev.filter((msg) => msg._id !== id)); 
      alert("Message deleted successfully.");
    } catch (err) {
      console.error("Failed to delete message", err);
      alert("Failed to delete message. Please try again.");
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="table-responsive">
      {messages.length === 0 ? (
        <p>No messages received yet.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Sr.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Received At</th>
              <th>Action</th> 
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, idx) => (
              <tr key={msg._id}>
                <td>{idx + 1}</td>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactMessages;
