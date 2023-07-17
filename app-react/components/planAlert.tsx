import { Alert } from "antd";
import { useEffect, useState } from "react";

type Props = {
  isConnected: boolean;
  endTime: number;
};

const AlertComponent = ({ isConnected, endTime }: Props) => {
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    calculateRemainingTime(endTime);
  }, [endTime]);

  const calculateRemainingTime = (remainingSeconds: number) => {
    if (remainingSeconds > 0) {
      const remainingDays = Math.floor(remainingSeconds / (24 * 60 * 60));
      const remainingHours = Math.floor(
        (remainingSeconds % (24 * 60 * 60)) / 3600
      );

      setRemainingTime(`${remainingDays} days and ${remainingHours} hours`);
    }
  };

  if (!isConnected)
    return (
      <Alert
        message="Connect wallet"
        description="Connect your wallet to access the dApp"
        type="warning"
        showIcon
      />
    );
  if (endTime <= 0)
    return (
      <Alert
        message="Choose plan"
        description="Choose your VPN plan to get more features"
        type="info"
        showIcon
      />
    );
  if (endTime > 0)
    return (
      <Alert
        message="You own your plan period"
        description={`Your plan time remaining: ${remainingTime}`}
        type="success"
        showIcon
      />
    );
};

export default AlertComponent;
