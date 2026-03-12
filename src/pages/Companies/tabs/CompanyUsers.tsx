import ComponentCard from "../../../components/common/ComponentCard";
import Table, { TableColumns } from "../../../components/ui/table/Table";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { Plus } from "lucide-react";

const columns: TableColumns = [
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email", sortable: true },
    { header: "Role", accessor: "role", sortable: true },
    {
        header: "Status",
        accessor: "status",
        cell: (row) => (
            <Badge color={row.status === "Active" ? "success" : "error"} size="sm">
                {row.status}
            </Badge>
        ),
        sortable: true
    },
];

const mockUsers = [
    { id: 1, name: "Ahmad Hassan", email: "ahmad@logistic-express.ae", role: "Admin", status: "Active" },
    { id: 2, name: "Fatima Ali", email: "fatima@logistic-express.ae", role: "Manager", status: "Active" },
    { id: 3, name: "Zaid Omar", email: "zaid@logistic-express.ae", role: "Dispatcher", status: "Inactive" },
];

export default function CompanyUsers() {
    return (
        <ComponentCard
            title="Company Users"
            desc="Staff members who have access to the company dashboard."
            actions={
                <div className="flex justify-end">
                    <Button size="sm" className="flex items-center gap-2">
                        <Plus className="size-4" /> Add User
                    </Button>
                </div>
            }
        >
            <Table columns={columns} data={mockUsers as unknown as Record<string, string>[]} />
        </ComponentCard>
    );
}
