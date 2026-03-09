import { createContext, useContext, useState, ReactNode } from "react";
import { formatDateYYYYMMDD } from "../lib/utils";
import { AnalyticsDateType, ORDER_CHANNEL } from "../types/General.enums";

export type TDashboardFilterDate = {
  startDate?: Date | null;
  endDate?: Date | null;
};
export type TDashboardFilterDateISO = {
  startDate?: string;
  endDate?: string;
};

export enum METRICS {
  REVENUE = "revenue",
  SALES = "sales",
}

interface DashboardContextProps {
  resetData: () => void;

  date: TDashboardFilterDate | null;
  dateISO: TDashboardFilterDateISO;
  setDate: (date: TDashboardFilterDate | null) => void;

  paymentMethod: string;
  setPaymentMethod: (method: string) => void;

  paymentGateway: string;
  setPaymentGateway: (gateway: string) => void;

  shopUuid: string;
  setShopUuid: (uuid: string) => void;

  dateType: AnalyticsDateType;
  setDateType: (type: AnalyticsDateType) => void;

  orderChannel: ORDER_CHANNEL;
  setOrderChannel: (channel: ORDER_CHANNEL) => void;

  metrics: METRICS;
  setMetrics: (metrics: METRICS) => void;
}

export interface requestParams {
  shopUuid?: string;
  paymentMethod?: string;
  paymentGateway?: string;

  startDate?: string;
  endDate?: string;
  dateType?: AnalyticsDateType;
  orderChannel?: ORDER_CHANNEL;

  metrics?: METRICS;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined,
);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Initialize default date range to current month (from 1st to last day of month)
  const today = new Date();
  const startOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );
  // Get the last day of current month
  const endOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  );

  const defaults = {
    startDate: startOfCurrentMonth,
    endDate: endOfCurrentMonth,
    paymentGateway: "",
    paymentMethod: "",
    dateType: AnalyticsDateType.ORDER_DATE,
    orderChannel: ORDER_CHANNEL.ALL,
    shopUuid: "",
  };

  const [date, setDate] = useState<TDashboardFilterDate | null>({
    startDate: defaults.startDate,
    endDate: defaults.endDate,
  });

  const [paymentMethod, setPaymentMethod] = useState<string>(
    defaults.paymentMethod,
  );
  const [paymentGateway, setPaymentGateway] = useState<string>(
    defaults.paymentGateway,
  );
  const [shopUuid, setShopUuid] = useState<string>(defaults.shopUuid);
  const [dateType, setDateType] = useState<AnalyticsDateType>(
    defaults.dateType,
  );

  const [orderChannel, setOrderChannel] = useState<ORDER_CHANNEL>(
    defaults.orderChannel,
  );

  const [metrics, setMetrics] = useState<METRICS>(METRICS.REVENUE);

  /** We will use ISO date in APIs */
  const dateISO: TDashboardFilterDateISO = {
    startDate: date?.startDate ? formatDateYYYYMMDD(date?.startDate) : "",
    endDate: date?.endDate ? formatDateYYYYMMDD(date?.endDate) : "",
  };

  function resetData() {
    setDate({
      startDate: defaults.startDate,
      endDate: defaults.endDate,
    });
    setDateType(defaults.dateType);
    setOrderChannel(defaults.orderChannel);
    setPaymentMethod(defaults.paymentMethod);
    setPaymentGateway(defaults.paymentGateway);
    setShopUuid(defaults.shopUuid);
    setOrderChannel(defaults.orderChannel);
    setDateType(defaults.dateType);
  }

  return (
    <DashboardContext.Provider
      value={{
        resetData,
        date,
        dateISO,
        setDate,
        paymentMethod,
        setPaymentMethod,
        paymentGateway,
        setPaymentGateway,
        shopUuid,
        setShopUuid,

        dateType,
        setDateType,

        orderChannel,
        setOrderChannel,

        metrics,
        setMetrics,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
