import React, { useState } from "react";

function NewMessage({ currentUser, onAddMessage }) {
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5555/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser.username,
          body: body,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add message");
      }

      const newMessage = await response.json();
      onAddMessage(newMessage);
      setBody("");
    } catch (error) {
      console.error("Error adding message:", error.message);
      // Handle error state or display error message to the user
    }
  };

  return (
    <form className="new-message" onSubmit={handleSubmit}>
      <input
        type="text"
        name="body"
        autoComplete="off"
        placeholder="Type your message..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default NewMessage;

