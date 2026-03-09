import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import apiEngine from "../../lib/axios";
import { API_ENDPOINTS } from "../../types/ApiEndpoints.enum";
import { AnalyticsOrdersSalesPeriodChartResponse } from "../../types/Reports.typs";
import LoadingCircle from "../ui/LoadingCircle";
import { requestParams, useDashboard } from "../../context/DashboardContext";
import { removeEmpty, formatDateYYYYMMDD } from "../../lib/utils";

type PeriodType = "daily" | "monthly" | "yearly";

export default function SalesChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
  const [chartData, setChartData] = useState<{
    categories: string[];
    series: Array<{ name: string; data: number[] }>;
  }>({
    categories: [],
    series: [{ name: "Sales", data: [] }],
  });
  const {
    shopUuid,
    paymentGateway,
    paymentMethod,
    date,
    dateType,
    orderChannel,
    metrics,
  } = useDashboard();
  const [loading, setLoading] = useState(false);

  const fetchChartData = useCallback(
    async (period: PeriodType) => {
      setLoading(true);
      try {
        const queryPrams: requestParams & { period: PeriodType } = {
          shopUuid,
          paymentGateway,
          paymentMethod,
          period,
          dateType,
          orderChannel,
          metrics,
        };
        // When daily is selected, derive month from dashboard date filter (startDate preferred)
        if (period === "daily") {
          const selectedDate = (date?.startDate ||
            date?.endDate ||
            new Date()) as Date;
          const year = selectedDate.getFullYear();
          const monthZeroBased = selectedDate.getMonth();
          const startOfMonth = new Date(year, monthZeroBased, 1);
          const endOfMonth = new Date(year, monthZeroBased + 1, 0);
          queryPrams.startDate = formatDateYYYYMMDD(startOfMonth);
          queryPrams.endDate = formatDateYYYYMMDD(endOfMonth);
        } else if (period === "monthly") {
          // For monthly view, use the entire year from global date filter
          const selectedDate = (date?.startDate ||
            date?.endDate ||
            new Date()) as Date;
          const year = selectedDate.getFullYear();
          const startOfYear = new Date(year, 0, 1);
          const endOfYear = new Date(year, 12, 0);
          queryPrams.startDate = formatDateYYYYMMDD(startOfYear);
          queryPrams.endDate = formatDateYYYYMMDD(endOfYear);
        }
        const response =
          await apiEngine.get<AnalyticsOrdersSalesPeriodChartResponse>(
            API_ENDPOINTS.ANALYTICS_ORDERS_SALES_PERIOD_CHART,
            {
              params: removeEmpty(queryPrams),
            },
          );

        const data = response.data.data;
        const categories = data.data.map((item) => item.label);
        const values = data.data.map((item) => item.value);

        setChartData({
          categories,
          series: [{ name: "Sales", data: values }],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      shopUuid,
      paymentGateway,
      paymentMethod,
      date,
      dateType,
      orderChannel,
      metrics,
    ],
  );

  useEffect(() => {
    fetchChartData(selectedPeriod);
  }, [fetchChartData, selectedPeriod]);

  const options: ApexOptions = {
    colors: ["#e39298"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const getPeriodTitle = (period: PeriodType) => {
    switch (period) {
      case "daily":
        return "Daily Sales";
      case "monthly":
        return "Monthly Sales";
      case "yearly":
        return "Yearly Sales";
      default:
        return "Sales";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {getPeriodTitle(selectedPeriod)}
          {selectedPeriod === "daily" && (
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-white/60">
              {(() => {
                const selectedDate = (date?.startDate ||
                  date?.endDate ||
                  new Date()) as Date;
                return selectedDate.toLocaleString("en", {
                  month: "long",
                  year: "numeric",
                });
              })()}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value as PeriodType)}
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {loading ? (
            <div className="flex items-center justify-center h-[180px]">
              <LoadingCircle />
            </div>
          ) : (
            <Chart
              options={options}
              series={chartData.series}
              type="bar"
              height={180}
            />
          )}
        </div>
      </div>
    </div>
  );
}
