import { useEffect, useState } from "react";

import {
  getRouteTypes,
  createRouteType,
  updateRouteType,
  deleteRouteType,
  type RouteType,
} from "../../api/routeTypesApi";

import { getApiErrorMessage } from "../../api/apiErrorHandler";

function AdminRouteTypesTab() {
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);

  const [name, setName] = useState("");
  const [driverPayment, setDriverPayment] = useState("");
  const [revenue, setRevenue] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDriverPayment, setEditDriverPayment] = useState("");
  const [editRevenue, setEditRevenue] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadRouteTypes();
  }, []);

  async function loadRouteTypes() {
    try {
      const data = await getRouteTypes();

      setRouteTypes(
        [...data].sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !driverPayment || !revenue) {
      setErrorMessage("Заповніть усі поля.");
      return;
    }

    try {
      await createRouteType({
        name: name.trim(),
        driverPayment: Number(driverPayment),
        revenue: Number(revenue),
      });

      setName("");
      setDriverPayment("");
      setRevenue("");

      await loadRouteTypes();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  function startEdit(routeType: RouteType) {
    setEditingId(routeType.id);
    setEditName(routeType.name);
    setEditDriverPayment(routeType.driverPayment.toString());
    setEditRevenue(routeType.revenue.toString());
    setErrorMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDriverPayment("");
    setEditRevenue("");
  }

  async function handleUpdate(id: string) {
    setErrorMessage("");

    if (!editName.trim() || !editDriverPayment || !editRevenue) {
      setErrorMessage("Заповніть усі поля.");
      return;
    }

    try {
      await updateRouteType(id, {
        name: editName.trim(),
        driverPayment: Number(editDriverPayment),
        revenue: Number(editRevenue),
      });

      cancelEdit();
      await loadRouteTypes();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити тип маршруту?")) {
      return;
    }

    try {
      await deleteRouteType(id);
      await loadRouteTypes();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  return (
    <div>
      <h2>Типи маршрутів</h2>

      {errorMessage && (
        <p style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleCreate} style={{ marginBottom: "25px" }}>
        <h3>Додати тип маршруту</h3>

        <div>
          <label>
            Назва:
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Оплата водію:
            <input
              type="number"
              value={driverPayment}
              onChange={(e) => setDriverPayment(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Дохід:
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">
          Додати тип маршруту
        </button>
      </form>

      <h3>Список типів маршрутів</h3>

      {routeTypes.length === 0 ? (
        <p>Типів маршрутів поки немає.</p>
      ) : (
        <div>
          {routeTypes.map((type) => (
            <div
              key={type.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
              }}
            >
              {editingId === type.id ? (
                <>
                  <div>
                    <label>
                      Назва:
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </label>
                  </div>

                  <div>
                    <label>
                      Оплата водію:
                      <input
                        type="number"
                        value={editDriverPayment}
                        onChange={(e) =>
                          setEditDriverPayment(e.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div>
                    <label>
                      Дохід:
                      <input
                        type="number"
                        value={editRevenue}
                        onChange={(e) => setEditRevenue(e.target.value)}
                      />
                    </label>
                  </div>

                  <button onClick={() => handleUpdate(type.id)}>
                    Зберегти
                  </button>

                  <button onClick={cancelEdit}>
                    Скасувати
                  </button>
                </>
              ) : (
                <>
                  <h4>{type.name}</h4>

                  <p>
                    <strong>Оплата водію:</strong>{" "}
                    {type.driverPayment} грн
                  </p>

                  <p>
                    <strong>Дохід:</strong>{" "}
                    {type.revenue} грн
                  </p>

                  <p>
                    <strong>Прибуток:</strong>{" "}
                    {type.revenue - type.driverPayment} грн
                  </p>

                  <button onClick={() => startEdit(type)}>
                    Редагувати
                  </button>

                  <button onClick={() => handleDelete(type.id)}>
                    Видалити
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminRouteTypesTab;