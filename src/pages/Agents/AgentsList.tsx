import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Table, { TableColumns } from "../../components/ui/table/Table";

const columns: TableColumns = [
  { header: "Agent", accessor: "name", sortable: true },
  { header: "Phone", accessor: "phone", sortable: false },
  { header: "Status", accessor: "status", sortable: true },
  { header: "Active Deliveries", accessor: "activeDeliveries", sortable: true },
  { header: "Rating", accessor: "rating", sortable: true },
];

const mockData = [
  {
    name: "Alex Johnson",
    phone: "+1 202 555 0147",
    status: "Online",
    activeDeliveries: "3",
    rating: "4.8",
  },
  {
    name: "Maria Garcia",
    phone: "+1 202 555 0199",
    status: "Offline",
    activeDeliveries: "0",
    rating: "4.5",
  },
  {
    name: "Chen Wei",
    phone: "+44 20 7946 0958",
    status: "On delivery",
    activeDeliveries: "1",
    rating: "4.9",
  },
];

export default function AgentsList() {
  return (
    <>
      <PageMeta
        title="Delivery Agents"
        description="Manage delivery agents and monitor their performance."
      />
      <ComponentCard
        title="Delivery Agents"
        desc="Overview of all delivery agents, their status, and current workload."
      >
        <Table columns={columns} data={mockData} />
      </ComponentCard>
    </>
  );
}

