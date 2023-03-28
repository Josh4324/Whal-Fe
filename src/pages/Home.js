import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  return (
    <div style={{ height: "100vh" }}>
      <h1 className="h1">Crypto General Chat (NFT needed for access)</h1>
      <div>
        <input
          placeholder="Name"
          type="text"
          onChange={(event) => setName(event.target.value)}
          required
          className="input"
        />
      </div>

      <Link
        onClick={(e) => (!name ? e.preventDefault() : null)}
        to={`/chat?name=${name}`}
      >
        <button className="btn2" type="submit">
          Sign In
        </button>
      </Link>
    </div>
  );
}
