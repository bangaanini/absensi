import { useState, useEffect } from "react";

export default function Home() {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadNames() {
    const res = await fetch("/api/names");
    const data = await res.json();
    setNames(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadNames();
  }, []);

  async function addName() {
    if (!newName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setLoading(false);
    if (res.ok) {
      setNewName("");
      loadNames();
    }
  }

  async function updateName() {
    if (!editName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/names", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, name: editName }),
    });
    setLoading(false);
    if (res.ok) {
      setEditId(null);
      setEditName("");
      loadNames();
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "20px auto", padding: 20 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 20 }}>
        📋 Absensi Proyek
      </h1>

      {/* Tambah Nama */}
      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        <input
          placeholder="Nama baru"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button
          onClick={addName}
          disabled={loading}
          style={{
            background: "#16a34a",
            color: "white",
            padding: "8px 16px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
          }}
        >
          Tambah
        </button>
      </div>

      {/* Daftar Nama */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Nama</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {names.map((n) => (
            <tr key={n.id}>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {editId === n.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ width: "100%", padding: 6 }}
                  />
                ) : (
                  n.name
                )}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
                {editId === n.id ? (
                  <button
                    onClick={updateName}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Simpan
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(n.id);
                      setEditName(n.name);
                    }}
                    style={{
                      background: "#f59e0b",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}