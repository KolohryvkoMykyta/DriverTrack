import { useEffect, useState } from "react";

import { getDrivers } from "../../api/driversApi";
import { getVehicles } from "../../api/vehiclesApi";
import { getRouteEntries } from "../../api/routeEntriesApi";
import { getFuelEntriesByDriverId } from "../../api/fuelEntriesApi";

function AdminOverviewTab() {
  const [driversCount, setDriversCount] = useState(0);
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [fuelEntriesCount, setFuelEntriesCount] = useState(0);

  const [totalDistance, setTotalDistance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const drivers = await getDrivers();
        const vehicles = await getVehicles();
        const routes = await getRouteEntries();

        const fuelEntries = await Promise.all(
          drivers.map((driver) => getFuelEntriesByDriverId(driver.id))
        );

        setDriversCount(drivers.length);
        setVehiclesCount(vehicles.length);
        setRoutesCount(routes.length);
        setFuelEntriesCount(fuelEntries.flat().length);

        setTotalDistance(
          routes.reduce((sum, route) => sum + route.totalDistance, 0)
        );

        setTotalEarnings(
          routes.reduce((sum, route) => sum + route.earnings, 0)
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOverview();
  }, []);

  if (isLoading) {
    return <p>Завантаження огляду...</p>;
  }

  return (
    <div>
      <h2>Огляд</h2>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h3>Водії</h3>
          <p>{driversCount}</p>
        </div>

        <div>
          <h3>Автомобілі</h3>
          <p>{vehiclesCount}</p>
        </div>

        <div>
          <h3>Маршрути</h3>
          <p>{routesCount}</p>
        </div>

        <div>
          <h3>Заправки</h3>
          <p>{fuelEntriesCount}</p>
        </div>

        <div>
          <h3>Загальний пробіг</h3>
          <p>{totalDistance} км</p>
        </div>

        <div>
          <h3>Загальний дохід</h3>
          <p>{totalEarnings} грн</p>
        </div>
      </div>
    </div>
  );
}

export default AdminOverviewTab;