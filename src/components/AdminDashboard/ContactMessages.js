import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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
                {/* <td>
                  <span
                    className={`badge ${
                      msg.status === "responded" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {msg.status}
                  </span>
                </td> */}
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactMessages;
