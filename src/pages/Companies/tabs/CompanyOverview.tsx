import ComponentCard from "../../../components/common/ComponentCard";
import { Users, Truck, Package, Activity } from "lucide-react";

export default function CompanyOverview() {
  const stats = [
    { label: "Total Drivers", value: "128", icon: <Users className="size-6 text-blue-500" />, change: "+12%", changeType: "increase" },
    { label: "Active Vehicles", value: "85", icon: <Truck className="size-6 text-purple-500" />, change: "+5%", changeType: "increase" },
    { label: "Total Orders", value: "1,240", icon: <Package className="size-6 text-orange-500" />, change: "+18%", changeType: "increase" },
    { label: "Performance", value: "94.2%", icon: <Activity className="size-6 text-green-500" />, change: "-0.5%", changeType: "decrease" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                {stat.icon}
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                stat.changeType === "increase" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <ComponentCard title="Company Information" desc="Basic legal and contact information for this company.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Company Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">Logistics Express LLC</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Trade License No</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">TL-9823712</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">TRN Number</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">100293848100003</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Contact Person</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">Ahmad Hassan</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email Address</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">contact@logistic-express.ae</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Phone Number</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">+971 4 123 4567</p>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
