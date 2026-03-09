import {
  ChevronDown,
  ChevronUp,
  Delete,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  METRICS,
  TDashboardFilterDate,
  useDashboard,
} from "../../context/DashboardContext";
import { AnalyticsDateType, ORDER_CHANNEL } from "../../types/General.enums";
import DatePicker from "../form/date-picker";
import { InputWrap } from "../form/InputWrap";
import PaymentMethodSelect from "../form/PaymentMethodSelect";
import Select from "../form/Select";
import Button from "../ui/button/Button";

const MetricsFilters: React.FC = () => {
  const {
    date,
    setDate,
    setPaymentMethod,
    setPaymentGateway,
    paymentMethod,
    paymentGateway,

    dateType,
    setDateType,
    orderChannel,
    setOrderChannel,
    resetData,

    metrics,
    setMetrics,
  } = useDashboard();

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const dateValue = [];
  if (date?.startDate) dateValue.push(date?.startDate);
  if (date?.endDate) dateValue.push(date?.endDate);

  const buttonRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setShowMoreFilters(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Mobile Toggle Button */}
      <div
        className="md:hidden grid gap-2 "
        style={{ gridTemplateColumns: "75% 25%" }}
      >
        <Button
          variant="outline"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full"
          startIcon={<SlidersHorizontal size={18} />}
        >
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          {mobileFiltersOpen ? (
            <ChevronUp size={18} className="ml-auto" />
          ) : (
            <ChevronDown size={18} className="ml-auto" />
          )}
        </Button>
        <Button
          startIcon={<Delete size={18} />}
          className="w-full"
          onClick={() => {
            resetData();
          }}
        >
          Clear
        </Button>
      </div>

      {/* Filters Container */}
      <div
        className={`${
          mobileFiltersOpen ? "block" : "hidden"
        } md:block transition-all duration-300`}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 [&_.input-field,input,select]:bg-white">
          <InputWrap label="Date Type">
            <Select
              options={Object.values(AnalyticsDateType).map((d) => ({
                value: d,
                label: d.toUpperCase().replace("_", " "),
              }))}
              value={dateType}
              onChange={(e) => {
                setDateType(e.target.value as AnalyticsDateType);
              }}
            />
          </InputWrap>

          <InputWrap label="Date">
            <DatePicker
              id="dashboard-date-picker"
              value={dateValue}
              onClose={(_dates) => {
                const changedDate: TDashboardFilterDate = {};

                if (_dates?.[0]) {
                  changedDate.startDate = _dates[0];
                }
                if (_dates?.[1]) {
                  changedDate.endDate = _dates[1];
                }
                setDate(changedDate);
              }}
              onClear={() => {
                setDate(null);
              }}
              minDate={""}
              mode="range"
              placeholder={"Date range"}
              clearButton={true}
            />
          </InputWrap>

          <InputWrap label="Payment Method">
            <PaymentMethodSelect
              label=""
              value={{
                paymentMethod: paymentMethod || "",
                paymentGateway: paymentGateway || "",
              }}
              onChange={(value) => {
                setPaymentMethod(value?.paymentMethod || "");
                setPaymentGateway(value?.paymentGateway || "");
              }}
            />
          </InputWrap>

         

          {/* More Filters Button - Desktop Only */}
          <InputWrap label="More filters" className="hidden md:block">
            <Button
              ref={buttonRef}
              variant="outline"
              size="sm"
              startIcon={<SlidersHorizontal size={18} />}
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              More Filters
              {showMoreFilters ? (
                <ChevronUp size={16} className="ml-1" />
              ) : (
                <ChevronDown size={16} className="ml-1" />
              )}
            </Button>
          </InputWrap>
        </div>

        {/* Additional Filters - Shows on desktop when "More Filters" is clicked, always visible on mobile */}
        <div
          className={`${showMoreFilters ? "block" : "hidden"} md:${
            showMoreFilters ? "block" : "hidden"
          } mt-5`}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 [&_.input-field,input,select]:bg-white">
            <InputWrap label="Order Channel">
              <Select
                options={Object.values(ORDER_CHANNEL).map((channel) => ({
                  value: channel,
                  label: channel.charAt(0).toUpperCase() + channel.slice(1),
                }))}
                value={orderChannel}
                onChange={(e) => {
                  setOrderChannel(e.target.value as ORDER_CHANNEL);
                }}
              />
            </InputWrap>
            <InputWrap label="Metrics">
              <Select
                options={[
                  {
                    value: "sales",
                    label: "Sales",
                  },
                  {
                    value: "revenue",
                    label: "Revenue",
                  },
                ]}
                value={metrics}
                onChange={(e) => {
                  setMetrics(e.target.value as METRICS);
                }}
              />
            </InputWrap>
            <InputWrap
              label="Reset"
              className="[&_label]:opacity-0 hidden md:block"
            >
              <Button
                startIcon={<Delete size={18} />}
                className="w-full"
                onClick={() => {
                  resetData();
                }}
                size="sm"
              >
                Clear
              </Button>
            </InputWrap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsFilters;
