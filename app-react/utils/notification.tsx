import { notification } from "antd";

export const successTransaction = () => {
  notification.success({
    message: "Transaction successful",
    placement: "bottomRight",
  });
};

export const checkTransaction = () => {
  notification.warning({
    message: "Check your wallet",
    placement: "bottomRight",
  });
};
