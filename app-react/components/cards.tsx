import { Card, Button } from "antd";
import { useBalance, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useEffect } from "react";
import { ABI, contractAddress } from "../contract/VPNmarket";
import { checkTransaction, successTransaction } from "../utils/notification";
import { fromWei } from "../utils/weiManager";
import Image from "next/image";

type CardProps = {
  id: number;
  imageSrc: string;
  price: number;
  daysPeriod: number;
  userAddress: any;
  isConnected: boolean;
  isActive: boolean;
};

const CardComponent: React.FC<CardProps> = ({
  id: planIndex,
  imageSrc,
  price,
  daysPeriod,
  userAddress,
  isConnected,
  isActive,
}) => {
  const userBalanceData = useBalance({
    address: userAddress,
    formatUnits: "wei",
  });

  const userBalance: number = !undefined
    ? Number(userBalanceData.data?.formatted)
    : 0;
  console.log(userBalance);

  const { config: buyPlan } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "buyPlan",
    args: [planIndex],
    value: price as any,
  });

  const { isLoading, isSuccess, write: buy } = useContractWrite(buyPlan);

  useEffect(() => {
    if (isLoading) {
      checkTransaction();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      successTransaction();
    }
  }, [isSuccess]);

  return (
    <Card
      cover={
        <div
          style={{ position: "relative", width: "100%", paddingTop: "100%" }}
        >
          <Image
            alt="product"
            layout="fill"
            objectFit="contain"
            quality={100}
            src={imageSrc}
          />
        </div>
      }
      actions={[
        <Button
          style={{ width: "150px" }}
          type="primary"
          size="large"
          key="buy-now"
          disabled={
            !isConnected || isActive || BigInt(userBalance) - BigInt(price) < 0
          }
          onClick={() => buy?.()}
        >
          {BigInt(userBalance) - BigInt(price) < 0
            ? "Not Enough ETH"
            : isActive
            ? "Plan is Active"
            : "Buy Now"}
        </Button>,
      ]}
    >
      <Card.Meta
        title={`${Number(daysPeriod) / 86400} days Plan`}
        description={`Price: ${fromWei(price)} ETH`}
      />
    </Card>
  );
};

export default CardComponent;
