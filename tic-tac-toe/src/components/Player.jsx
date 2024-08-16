import { useState } from "react";

export default function Player({ initialName, symbol }) {
  const [name, setName] = useState(initialName);
  const [isEditing, setEditing] = useState(false);

  function handleEditClick() {
    setEditing((wasEditing) => !wasEditing);
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <li>
      <span className="player">
        {isEditing ? (
          <input type="text" required value={name} onChange={handleChange} />
        ) : (
          <span className="player-name">{name}</span>
        )}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}
