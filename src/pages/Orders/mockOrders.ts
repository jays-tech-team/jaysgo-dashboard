export type MockOrder = {
  order_uuid: string;
  order_number: string;
  customer_name: string;
  address: string;
  order_status: string;
  assigned_to: string;
  scheduled_at: string; // YYYY-MM-DD
  delivery_date: string; // YYYY-MM-DD
  created_at: string; // YYYY-MM-DD
};

export const MOCK_ORDERS: MockOrder[] = [
  {
    order_uuid: "ord_1024",
    order_number: "#ORD-1024",
    customer_name: "Jane Doe",
    address: "221B Baker Street, London",
    order_status: "pending_assignment",
    assigned_to: "Unassigned",
    scheduled_at: "2026-03-12",
    delivery_date: "2026-03-12",
    created_at: "2026-03-09",
  },
  {
    order_uuid: "ord_1025",
    order_number: "#ORD-1025",
    customer_name: "John Smith",
    address: "742 Evergreen Terrace, Springfield",
    order_status: "out_for_delivery",
    assigned_to: "Driver - Alex",
    scheduled_at: "2026-03-11",
    delivery_date: "2026-03-11",
    created_at: "2026-03-09",
  },
  {
    order_uuid: "ord_1026",
    order_number: "#ORD-1026",
    customer_name: "Acme Corp",
    address: "1600 Amphitheatre Parkway, CA",
    order_status: "delivered",
    assigned_to: "Company - FastShip",
    scheduled_at: "2026-03-10",
    delivery_date: "2026-03-10",
    created_at: "2026-03-09",
  },
];

