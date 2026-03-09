import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Table, { TableColumns } from "../../components/ui/table/Table";

const columns: TableColumns = [
  { header: "Company", accessor: "name", sortable: true },
  { header: "Service Area", accessor: "serviceArea", sortable: true },
  { header: "Status", accessor: "status", sortable: true },
  { header: "Active Orders", accessor: "activeOrders", sortable: true },
  { header: "Rating", accessor: "rating", sortable: true },
];

const mockData = [
  {
    name: "FastShip Logistics",
    serviceArea: "City-wide",
    status: "Active",
    activeOrders: "24",
    rating: "4.7",
  },
  {
    name: "GreenRoute Delivery",
    serviceArea: "Downtown",
    status: "Paused",
    activeOrders: "0",
    rating: "4.4",
  },
  {
    name: "ExpressWheels",
    serviceArea: "Suburbs",
    status: "Active",
    activeOrders: "15",
    rating: "4.6",
  },
];

export default function CompaniesList() {
  return (
    <>
      <PageMeta
        title="Delivery Companies"
        description="Manage external delivery partners and their performance."
      />
      <ComponentCard
        title="Delivery Companies"
        desc="Overview of all delivery partners, their coverage, and live load."
      >
        <Table columns={columns} data={mockData} />
      </ComponentCard>
    </>
  );
}

