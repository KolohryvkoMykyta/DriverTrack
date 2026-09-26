import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Plus, Search } from "lucide-react";

import { getApiErrorMessage } from "../../api/apiErrorHandler";
import {
  deleteRouteType,
  getRouteTypes,
  type RouteType,
} from "../../api/routeTypesApi";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";

import DeleteRouteTypeModal from "./route-types/DeleteRouteTypeModal";
import RouteTypeModal from "./route-types/RouteTypeModal";
import RouteTypesSummaryCards from "./route-types/RouteTypesSummaryCards";
import RouteTypesTable from "./route-types/RouteTypesTable";

import "../../styles/admin-route-types.css";

const ROUTE_TYPES_PAGE_SIZE = 5;

function AdminRouteTypesTab() {
  const { clearSidebarContent } = useAdminSidebar();

  const [routeTypes, setRouteTypes] = useState<RouteType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRouteType, setEditingRouteType] =
    useState<RouteType | null>(null);
  const [deletingRouteType, setDeletingRouteType] =
    useState<RouteType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function loadRouteTypes() {
    try {
      setErrorMessage("");
      const data = await getRouteTypes();
      setRouteTypes(
        [...data].sort((a, b) => a.name.localeCompare(b.name, "uk"))
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    clearSidebarContent();
  }, [clearSidebarContent]);

  useEffect(() => {
    let isCancelled = false;

    void getRouteTypes()
      .then((data) => {
        if (!isCancelled) {
          setRouteTypes(
            [...data].sort((a, b) => a.name.localeCompare(b.name, "uk"))
          );
          setErrorMessage("");
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setErrorMessage(getApiErrorMessage(error));
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const filteredRouteTypes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("uk");

    if (!normalizedQuery) {
      return routeTypes;
    }

    return routeTypes.filter((routeType) =>
      routeType.name.toLocaleLowerCase("uk").includes(normalizedQuery)
    );
  }, [routeTypes, searchQuery]);

  const totalPages = Math.ceil(
    filteredRouteTypes.length / ROUTE_TYPES_PAGE_SIZE
  );
  const pagedRouteTypes = filteredRouteTypes.slice(
    (currentPage - 1) * ROUTE_TYPES_PAGE_SIZE,
    currentPage * ROUTE_TYPES_PAGE_SIZE
  );

  const averageRevenue =
    routeTypes.length > 0
      ? routeTypes.reduce((sum, item) => sum + item.revenue, 0) /
        routeTypes.length
      : 0;
  const averageDriverPayment =
    routeTypes.length > 0
      ? routeTypes.reduce((sum, item) => sum + item.driverPayment, 0) /
        routeTypes.length
      : 0;
  const averageRemainder = averageRevenue - averageDriverPayment;

  async function handleDelete() {
    if (!deletingRouteType) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");
      await deleteRouteType(deletingRouteType.id);
      setDeletingRouteType(null);
      await loadRouteTypes();
      setCurrentPage(1);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="route-types-page">
      <section className="route-types-toolbar">
        <label className="route-types-search">
          <Search size={18} />
          <input
            type="search"
            value={searchQuery}
            placeholder="Пошук за назвою"
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
          />
        </label>

        <button
          type="button"
          className="route-types-button route-types-button--primary"
          onClick={() => {
            setEditingRouteType(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={19} />
          Додати тип
        </button>
      </section>

      <RouteTypesSummaryCards
        count={routeTypes.length}
        averageRevenue={averageRevenue}
        averageDriverPayment={averageDriverPayment}
        averageRemainder={averageRemainder}
      />

      {isLoading ? (
        <div className="route-types-page__message">
          Завантаження типів маршрутів...
        </div>
      ) : errorMessage ? (
        <div className="route-types-page__message route-types-page__message--error">
          <p>{errorMessage}</p>
          <button
            type="button"
            className="route-types-button route-types-button--secondary"
            onClick={() => void loadRouteTypes()}
          >
            Спробувати ще раз
          </button>
        </div>
      ) : (
        <RouteTypesTable
          routeTypes={pagedRouteTypes}
          totalCount={filteredRouteTypes.length}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          onEdit={(routeType) => {
            setEditingRouteType(routeType);
            setIsFormOpen(true);
          }}
          onDelete={(routeType) => {
            setDeleteError("");
            setDeletingRouteType(routeType);
          }}
          onPageChange={setCurrentPage}
        />
      )}

      {isFormOpen && (
        <RouteTypeModal
          routeType={editingRouteType}
          onClose={() => setIsFormOpen(false)}
          onSaved={async () => {
            await loadRouteTypes();
            setCurrentPage(1);
          }}
        />
      )}

      {deletingRouteType && (
        <DeleteRouteTypeModal
          routeType={deletingRouteType}
          isDeleting={isDeleting}
          errorMessage={deleteError}
          onClose={() => {
            if (!isDeleting) {
              setDeletingRouteType(null);
            }
          }}
          onConfirm={() => void handleDelete()}
        />
      )}
    </div>
  );
}

export default AdminRouteTypesTab;
