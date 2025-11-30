import React, { useState } from "react";

function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/forgot-password", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div className="container mt-5">
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          className="form-control mt-3" 
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-primary mt-3">Submit</button>
      </form>

      {msg && <p className="mt-3">{msg}</p>}
    </div>
  );
}

export default Forgot;