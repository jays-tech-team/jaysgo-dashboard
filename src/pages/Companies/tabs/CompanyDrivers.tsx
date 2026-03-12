import ComponentCard from "../../../components/common/ComponentCard";
import Table, { TableColumns } from "../../../components/ui/table/Table";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { Plus } from "lucide-react";

const columns: TableColumns = [
  {
    header: "Driver Name",
    accessor: "name",
    cell: (row) => (
      <span className="text-brand-500 font-medium">
        {row.name}
      </span>
    ),
    sortable: true
  },
  { header: "Phone", accessor: "phone", sortable: false },
  { header: "License Category", accessor: "licenseCategory", sortable: true },
  {
    header: "Status",
    accessor: "status",
    cell: (row) => {
      let color: "success" | "warning" | "error" | "info" = "info";
      if (row.status === "Available") color = "success";
      if (row.status === "On Delivery") color = "warning";
      if (row.status === "Off Duty") color = "error";

      return <Badge color={color} size="sm">{row.status}</Badge>;
    },
    sortable: true
  },
  { header: "Assigned Vehicle", accessor: "assignedVehicle", sortable: true },
];

const mockDrivers = [
  {
    id: "DRV-001",
    name: "Michael Chen",
    phone: "+971 50 123 4567",
    licenseCategory: "Light Motor Vehicle",
    status: "On Delivery",
    assignedVehicle: "V-204 (Refrigerated Van)",
  },
  {
    id: "DRV-002",
    name: "Sarah Ahmed",
    phone: "+971 55 987 6543",
    licenseCategory: "Motorcycle",
    status: "Available",
    assignedVehicle: "B-102 (E-Bike)",
  },
  {
    id: "DRV-003",
    name: "David Smith",
    phone: "+971 52 456 7890",
    licenseCategory: "Light Motor Vehicle",
    status: "Off Duty",
    assignedVehicle: "Unassigned",
  },
  {
    id: "DRV-004",
    name: "Priya Patel",
    phone: "+971 56 321 0987",
    licenseCategory: "Light Motor Vehicle",
    status: "On Delivery",
    assignedVehicle: "C-305 (Sedan - A/C)",
  },
];

export default function CompanyDrivers() {
  return (
    <ComponentCard
      title="Fleet Drivers"
      desc="All registered drivers for this company."
      actions={
        <div className="flex justify-end">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="size-4" /> Add Driver
          </Button>
        </div>
      }
    >
      <Table columns={columns} data={mockDrivers} />
    </ComponentCard>
  );
}
