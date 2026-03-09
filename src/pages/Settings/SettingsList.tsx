import { Edit, Plus } from "lucide-react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import DataTable, { TableActions } from "../../components/tables/DataTable";
import { formatDate } from "../../lib/utils";
import { API_ENDPOINTS } from "../../types/ApiEndpoints.enum";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/button/Button";

export default function SettingsList() {
  const { hasPermission, isAdmin } = useAuth();

  return (
    <>
      <PageMeta title="Settings List" description="" />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage application settings</p>
        </div>
        {(hasPermission([]) || isAdmin()) && (
          <Link to="/admin/settings/add">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Setting
            </Button>
          </Link>
        )}
      </div>
      <DataTable
        key={"settings"}
        api={`/${API_ENDPOINTS.SETTINGS_CONFIG}`}
        filters={[
          {
            label: "Search",
            key: "filters[search]",
            type: "search",
          },
        ]}
        columns={[
          {
            header: "Name",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Value",
            accessor: "value",
            sortable: false,
            cell: (row) => (
              <div className="max-w-xs truncate" title={row.value}>
                {row.value || "—"}
              </div>
            ),
          },
          {
            header: "Data Type",
            accessor: "data_type",
            sortable: true,
            cell: (row) => (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {row.data_type}
              </span>
            ),
          },
          {
            header: "Created At",
            accessor: "created_at",
            sortable: true,
            cell: (row) => formatDate(row.created_at),
          },
          {
            header: "Updated At",
            accessor: "updated_at",
            sortable: true,
            cell: (row) => formatDate(row.updated_at),
          },
          {
            header: "Actions",
            accessor: "actions",
            cell: (row, onRefresh) => {
              return (
                <TableActions
                  onRefresh={onRefresh}
                  buttons={[
                    {
                      icon: <Edit className="w-5 h-5" />,
                      permissions: [],
                      path: `/admin/settings/edit/${row.setting_uuid}`,
                    },
                  ]}
                />
              );
            },
            sortable: false,
          },
        ]}
      />
    </>
  );
}
