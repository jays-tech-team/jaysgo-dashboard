import { NavLink, Outlet, useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

export default function CompanyDetailsLayout() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock company data - in a real app, this would be fetched based on id
  const company = useMemo(() => {
    return {
      id,
      name: id === "1" ? "Logistics Express" : "FastShip Logistics",
      description: "Manage company operations and global logistics workflows",
    };
  }, [id]);

  const tabs = [
    { name: "Overview", path: "" },
    { name: "Orders", path: "orders" },
    { name: "Drivers", path: "drivers" },
    { name: "Vehicles", path: "vehicles" },
    { name: "Documents", path: "documents" },
    { name: "Users", path: "users" },
    { name: "Settings", path: "settings" },
  ];

  return (
    <>
      <PageMeta
        title={`${company.name} Details`}
        description={company.description}
      />

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/admin/companies")}
            className="flex items-center justify-center size-10 text-gray-500 hover:text-brand-500 transition-colors border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {company.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {company.description}
            </p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mt-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.path === ""}
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
}
