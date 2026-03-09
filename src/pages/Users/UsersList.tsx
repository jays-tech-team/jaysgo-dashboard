import { LockIcon, Trash2 } from "lucide-react";
import DataTable, { TableActions } from "../../components/tables/DataTable";
import Avatar from "../../components/ui/avatar/Avatar";
import Badge from "../../components/ui/badge/Badge";
import { TableColumns } from "../../components/ui/table/Table";
import { formatDate } from "../../lib/utils";
import { USER_ROLES } from "../../unities/permissions";
import UserChangePassword from "../../components/UserProfile/UserChangePassword";
import { useAuth } from "../../context/AuthContext";

const filters = [
  {
    key: "search",
    label: "Search",
    type: "search" as const,
  },
];

export default function UsersList() {
  const { isAdmin } = useAuth();
  const columns: TableColumns = [
    {
      header: "Avatar",
      accessor: "image",
      cell: (row) => (
        <Avatar
          src={row.image || "/images/user/agent-placeholder-Image.jpg"}
          alt={row.first_name + " " + row.last_name}
          size="small"
        />
      ),
      sortable: false,
    },
    {
      header: "Name",
      accessor: "first_name",
      cell: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      header: "Roles",
      accessor: "roles",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.roles) &&
            row.roles.map((role: USER_ROLES) => (
              <Badge key={role} color="info" size="sm">
                {role}
              </Badge>
            ))}
        </div>
      ),
      sortable: false,
    },
    {
      header: "Status",
      accessor: "user_status",
      cell: (row) => (
        <Badge
          color={row.user_status === "active" ? "success" : "error"}
          size="sm"
        >
          {row.user_status || "unknown"}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: "Created",
      accessor: "created_at",
      cell: (row) => formatDate(row.created_at),
      sortable: true,
    },
    {
      header: "Actions",
      accessor: "action",
      cell: (row, onRefresh) => (
        <div className="text-start flex items-center gap-3">
          <UserChangePassword
            buttonText=""
            isAdmin={isAdmin()}
            userUUID={row.user_uuid}
            button={<LockIcon />}
          />
          <TableActions
            onRefresh={onRefresh}
            buttons={[
              {
                icon: <Trash2 />,
                deleteAPI: "/admin/users/" + row.user_uuid,
              },
            ]}
          />
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <DataTable
      title="Users List"
      api="/admin/users"
      columns={columns}
      filters={filters}
    />
  );
}
