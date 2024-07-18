import { useEffect, useState } from "react";
import "./app.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, email, age };

    fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers([...users, data]);
        setName("");
        setEmail("");
        setAge("");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { name, email, age };

    fetch(`http://localhost:8000/users/${currentUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(
          users.map((user) => (user.id === currentUserId ? data : user))
        );
        setIsEditing(false);
        setCurrentUserId(null);
        setName("");
        setEmail("");
        setAge("");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const handleDelete = (userID) => {
    fetch(`http://localhost:8000/users/${userID}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setUsers(users.filter((user) => user.id !== userID));
        } else {
          console.error("Error deleting user:", res.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Crud App With React</h1>
      <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit" className="submit">
          {isEditing ? "Update" : "Submit"}
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="edit">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
