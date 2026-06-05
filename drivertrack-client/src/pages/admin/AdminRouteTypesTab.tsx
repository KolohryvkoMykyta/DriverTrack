import { useEffect, useState } from "react";

import {
  getRouteTypes,
  createRouteType,
  deleteRouteType,
  type RouteType,
} from "../../api/routeTypesApi";

function AdminRouteTypesTab() {
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);

  const [name, setName] = useState("");
  const [earnings, setEarnings] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadRouteTypes();
  }, []);

  async function loadRouteTypes() {
    try {
      const data = await getRouteTypes();

      setRouteTypes(
        [...data].sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch {
      setError("Failed to load route types.");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !earnings) {
      setError("Fill all fields.");
      return;
    }

    try {
      await createRouteType(
        name,
        Number(earnings)
      );

      setName("");
      setEarnings("");

      await loadRouteTypes();
    } catch {
      setError("Failed to create route type.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete route type?")) {
      return;
    }

    try {
      await deleteRouteType(id);

      await loadRouteTypes();
    } catch {
      setError("Failed to delete route type.");
    }
  }

  return (
    <div>
      <h2>Route Types</h2>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        style={{ marginBottom: "20px" }}
      >
        <h3>Add Route Type</h3>

        <div>
          <label>
            Name:
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </label>
        </div>

        <div>
          <label>
            Earnings:
            <input
              type="number"
              value={earnings}
              onChange={(e) =>
                setEarnings(e.target.value)
              }
            />
          </label>
        </div>

        <button type="submit">
          Add Route Type
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Earnings</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {routeTypes.map((type) => (
            <tr key={type.id}>
              <td>{type.name}</td>

              <td>{type.earnings}</td>

              <td>
                <button
                  onClick={() =>
                    handleDelete(type.id)
                  }
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

export default AdminRouteTypesTab;