import { useState, useEffect } from "react";

export default function Home() {
  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  // Ambil data awal
  useEffect(() => {
    fetch("/api/names")
      .then((res) => res.json())
      .then((data) => setNames(data));
  }, []);

  // Tambah nama
  const addName = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const data = await res.json();
    if (!data.error) {
      setNames([...names, data]);
      setNewName("");
    }
  };

  // Edit nama
  const updateName = async () => {
    if (!editName.trim()) return;
    const res = await fetch("/api/names", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, name: editName }),
    });
    const data = await res.json();
    if (!data.error) {
      setNames(names.map(n => n.id === editId ? data : n));
      setEditId(null);
      setEditName("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Absensi Proyek</h1>

      {/* Form tambah nama */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Nama baru"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={addName}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Tambah
        </button>
      </div>

      {/* Tabel nama */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {names.map((n) => (
            <tr key={n.id}>
              <td className="border p-2">
                {editId === n.id ? (
                  <input
                    className="border p-1 w-full"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  n.name
                )}
              </td>
              <td className="border p-2 text-center">
                {editId === n.id ? (
                  <button
                    onClick={updateName}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Simpan
                  </button>
                ) : (
                  <button
                    onClick={() => { setEditId(n.id); setEditName(n.name); }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
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