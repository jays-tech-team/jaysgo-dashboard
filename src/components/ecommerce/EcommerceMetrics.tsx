import { CircleUserRound, ShoppingBag } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import {
  METRICS,
  requestParams,
  useDashboard,
} from "../../context/DashboardContext";
import apiEngine from "../../lib/axios";
import { __clog, removeEmpty } from "../../lib/utils";
import { API_ENDPOINTS } from "../../types/ApiEndpoints.enum";
import { ApiResponse } from "../../types/General.api.types";
import RenderPrice from "../ui/Price";

type CustomersAnalyticsResponse = { total_customers: number };

export default function EcommerceMetrics() {
  const {
    dateISO: filterDate,
    shopUuid,
    paymentGateway,
    paymentMethod,
    dateType,
    orderChannel,
  } = useDashboard();

  async function fetchData() {
    try {
      const queryPrams: requestParams = {
        startDate: filterDate?.startDate,
        endDate: filterDate?.endDate,
        shopUuid,
        paymentGateway,
        paymentMethod,
        dateType,
        orderChannel,
      };
      const response = await apiEngine.get<
        ApiResponse<CustomersAnalyticsResponse>
      >(API_ENDPOINTS.ANALYTICS_CUSTOMERS, {
        params: removeEmpty(queryPrams),
      });
      return response.data.data;
    } catch (error) {
      __clog("API Error", error);
    }
  }

  const [data, action, isLoading] = useActionState(fetchData, null);

  useEffect(() => {
    startTransition(() => {
      action();
    });
  }, [action, filterDate]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <CircleUserRound className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {isLoading ? (
                <div className="w-6 h-8 rounded-md bg-gray-300 animate-pulse"></div>
              ) : (
                data?.total_customers
              )}
            </h4>
          </div>
        </div>
      </div>
      <OrderMetrics />
      {/* <!-- Metric Item End --> */}
    </div>
  );
}

function OrderMetrics() {
  type AnalyticsOrders = {
    total_orders: number;
    total_order_amount: number;
    total_revenue_amount: number;
    amount: number;
  };

  const {
    dateISO: filterDate,
    shopUuid,
    paymentGateway,
    paymentMethod,
    dateType,
    orderChannel,
    metrics,
  } = useDashboard();
  async function fetchData() {
    try {
      const queryPrams: requestParams = {
        startDate: filterDate?.startDate,
        endDate: filterDate?.endDate,
        shopUuid,
        paymentGateway,
        paymentMethod,
        dateType,
        orderChannel,
        metrics,
      };
      const response = await apiEngine.get<ApiResponse<AnalyticsOrders>>(
        API_ENDPOINTS.ANALYTICS_ORDERS,
        {
          params: removeEmpty(queryPrams),
        },
      );

      return response.data.data;
    } catch (error) {
      __clog("API Error", error);
    }
  }

  const [data, action, isLoading] = useActionState(fetchData, null);

  useEffect(() => {
    startTransition(() => {
      action();
    });
  }, [action, filterDate]);
  return (
    <div className="flex text-end justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <ShoppingBag className="text-gray-800 size-6 dark:text-white/90" />
      </div>
      <div className="flex flex-col ">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Orders
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {isLoading ? (
              <div className="w-12 h-8 rounded-md bg-gray-300 animate-pulse"></div>
            ) : (
              data?.total_orders
            )}
          </h4>
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Order {metrics === METRICS.REVENUE ? "Revenue" : "Sales"}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {isLoading ? (
              <div className="w-12 h-8 rounded-md bg-gray-300 animate-pulse"></div>
            ) : (
              <RenderPrice regularPrice={Number(data?.amount)} />
            )}
          </h4>
        </div>
      </div>
    </div>
  );
}
