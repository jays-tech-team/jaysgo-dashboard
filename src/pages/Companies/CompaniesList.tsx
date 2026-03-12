import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Table, { TableColumns } from "../../components/ui/table/Table";
import Button from "../../components/ui/button/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const columns: TableColumns = [
  { header: "Company", accessor: "name", sortable: true },
  { header: "Service Area", accessor: "serviceArea", sortable: true },
  { header: "Status", accessor: "status", sortable: true },
  { header: "Active Orders", accessor: "activeOrders", sortable: true },
  { header: "Rating", accessor: "rating", sortable: true },
];

const mockData = [
  {
    id: "1",
    name: "FastShip Logistics",
    serviceArea: "City-wide",
    status: "Active",
    activeOrders: "24",
    rating: "4.7",
  },
  {
    id: "2",
    name: "GreenRoute Delivery",
    serviceArea: "Downtown",
    status: "Paused",
    activeOrders: "0",
    rating: "4.4",
  },
  {
    id: "3",
    name: "ExpressWheels",
    serviceArea: "Suburbs",
    status: "Active",
    activeOrders: "15",
    rating: "4.6",
  },
];

export default function CompaniesList() {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="Delivery Companies"
        description="Manage external delivery partners and their performance."
      />
      <ComponentCard
        title="Delivery Companies"
        desc="Overview of all delivery partners, their coverage, and live load."
        actions={
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => navigate("/admin/companies/add")}
              className="flex items-center gap-2"
            >
              <Plus className="size-4" />
              Add Company
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          data={mockData as unknown as Record<string, string>[]}
          viewPath="/admin/companies/:id"
        />
      </ComponentCard>
    </>
  );
}

