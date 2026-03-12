import ComponentCard from "../../../components/common/ComponentCard";
import Table, { TableColumns } from "../../../components/ui/table/Table";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { Plus } from "lucide-react";

const columns: TableColumns = [
  {
    header: "Plate Number",
    accessor: "plate",
    cell: (row) => (
      <span className="text-brand-500 font-medium">
        {row.plate}
      </span>
    ),
    sortable: true
  },
  { header: "Make & Model", accessor: "makeModel", sortable: true },
  { header: "Type", accessor: "type", sortable: true },
  {
    header: "Status",
    accessor: "status",
    cell: (row) => {
      let color: "success" | "warning" | "error" | "info" = "info";
      if (row.status === "Active") color = "success";
      if (row.status === "In Maintenance") color = "warning";
      if (row.status === "Inactive") color = "error";

      return <Badge color={color} size="sm">{row.status}</Badge>;
    },
    sortable: true
  },
  { header: "Assigned Driver", accessor: "assignedDriver", sortable: true },
];

const mockVehicles = [
  {
    id: "V-204",
    plate: "DXB 58291",
    makeModel: "Nissan Urvan",
    type: "Refrigerated Van",
    status: "Active",
    assignedDriver: "Michael Chen",
  },
  {
    id: "C-305",
    plate: "DXB 19283",
    makeModel: "Toyota Yaris",
    type: "Sedan (A/C)",
    status: "Active",
    assignedDriver: "Priya Patel",
  },
  {
    id: "V-207",
    plate: "SHJ 88392",
    makeModel: "Toyota Hiace",
    type: "Refrigerated Van",
    status: "In Maintenance",
    assignedDriver: "Unassigned",
  },
  {
    id: "B-102",
    plate: "AUH 2039",
    makeModel: "Honda Cargo",
    type: "E-Bike (Cooler Box)",
    status: "Active",
    assignedDriver: "Sarah Ahmed",
  },
];

export default function CompanyVehicles() {
  return (
    <ComponentCard
      title="Company Fleet"
      desc="All registered vehicles for this company."
      actions={
        <div className="flex justify-end">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="size-4" /> Add Vehicle
          </Button>
        </div>
      }
    >
      <Table columns={columns} data={mockVehicles} />
    </ComponentCard>
  );
}
