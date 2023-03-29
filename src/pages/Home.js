import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  return (
    <div style={{ height: "100vh" }}>
      <h1 className="h1">Crypto General Chat (NFT needed for access)</h1>
      <a
        target="_blank"
        href="//mumbai.polygonscan.com/address/0x2c17678699071e97c65b50cd02014c099e3f0bf1#writeContract"
        rel="noreferrer"
      >
        <button className="btn2">Buy NFT (0.0001 matic (testnet))</button>
      </a>

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
