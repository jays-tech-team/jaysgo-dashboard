import { CircleX } from "lucide-react";
import { useNavigate } from "react-router";
import NotificationAudio from "../../common/NotificationAudio";
import Button from "../../ui/button/Button";

import { useNotification } from "../../../context/NotificationContext";
import { useEffect, useState } from "react";
import { publicPath } from "../../../lib/utils";

const NotificationNewOrder: React.FC = () => {
  const { newOrderCount, clearOrderCount } = useNotification();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    setOrderCount(newOrderCount);
  }, [newOrderCount, setOrderCount]);

  const redirect = useNavigate();
  if (orderCount <= 0) return null;
  return (
    <div className="fixed  bottom-6 right-6 z-100 ">
      <NotificationAudio />
      <div className="absolute z-10 left-1/2 top-1/2 -translate-1/2 w-2/3 h-2/3 bg-green-600 rounded-2xl animate-ping"></div>
      <div className=" relative z-20 flex flex-col items-center px-4 py-3 bg-green-600 rounded-2xl shadow-lg animate w-76">
        <CircleX
          className="absolute top-3 left-3 text-white cursor-pointer"
          onClick={() => {
            setOrderCount(0);
          }}
        />
        <div className="bg-white rounded-full w-20 mb-4 p-2">
          <img
            src={publicPath("/images/bell.gif")}
            width={200}
            height={200}
            alt="bell"
            title="bell"
          />
        </div>
        <span className="font-semibold text-white mb-4 text-lg flex gap-2 items-center">
          <span className="bg-white text-green-600 inline-flex rounded-full h-5 w-5 items-center justify-center text-sm">
            {newOrderCount}
          </span>
          <span>New Order Received!</span>
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              clearOrderCount();
              redirect("/admin/orders");
            }}
            aria-label="Close"
            size="sm"
          >
            Go To Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationNewOrder;
