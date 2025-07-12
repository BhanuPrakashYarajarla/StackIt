import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminSignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, is_admin: true }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Sign Up</h2>
        <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
          <input className="border p-2 rounded" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="border p-2 rounded" type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full">Sign Up as Admin</Button>
        </form>
        {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
        <Button variant="link" className="w-full" onClick={() => navigate("/admin-login")}>Back to Admin Login</Button>
      </div>
    </div>
  );
};

export default AdminSignupPage; 