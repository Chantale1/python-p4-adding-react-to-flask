import React, { useEffect, useState } from "react";
import Header from "./Header";
import Search from "./Search";
import MessageList from "./MessageList";
import NewMessage from "./NewMessage";

const testUser = { username: "Duane" };

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/messages");
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const messages = await response.json();
        setMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleAddMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  const handleDeleteMessage = (id) => {
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
  };

  const handleUpdateMessage = (updatedMessageObj) => {
    const updatedMessages = messages.map((message) =>
      message.id === updatedMessageObj.id ? updatedMessageObj : message
    );
    setMessages(updatedMessages);
  };

  const displayedMessages = messages.filter((message) =>
    message.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className={isDarkMode ? "dark-mode" : ""}>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />
      <Search search={search} onSearchChange={setSearch} />
      <MessageList
        messages={displayedMessages}
        currentUser={testUser}
        onMessageDelete={handleDeleteMessage}
        onUpdateMessage={handleUpdateMessage}
      />
      <NewMessage currentUser={testUser} onAddMessage={handleAddMessage} />
    </main>
  );
}

export default App;

