import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/SalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import { DashboardProvider } from "../../context/DashboardContext";
import MetricsFilters from "../../components/ecommerce/MetricsFilters";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Delivery Operations Dashboard"
        description="Delivery performance overview with charts and metrics."
      />
      <DashboardProvider>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <MetricsFilters />
          </div>
          <div className="col-span-12 space-y-6 xl:col-span-7">
            <EcommerceMetrics />
            <MonthlySalesChart />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <MonthlyTarget />
          </div>

          <div className="col-span-12">
            <StatisticsChart />
          </div>
        </div>
      </DashboardProvider>
    </>
  );
}
