import { Card, Button } from "antd";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useEffect } from "react";
import { ABI, contractAddress } from "../contract/VPNmarket";
import { checkTransaction, successTransaction } from "../utils/notification";
import { fromWei } from "../utils/weiManager";

type CardProps = {
  id: number;
  imageSrc: string;
  price: number;
  daysPeriod: number;
  isConnected: boolean;
};

const CardComponent: React.FC<CardProps> = ({
  id: planIndex,
  imageSrc,
  price,
  daysPeriod,
  isConnected,
}) => {
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
      cover={<img alt="product" style={{width:"300px"}} src={imageSrc} />}
      actions={[
        <Button
          style={{ width: "150px" }}
          type="primary"
          size="large"
          key="buy-now"
          disabled={!isConnected}
          onClick={() => buy?.()}
        >
          Buy Now
        </Button>,
      ]}
    >
      <Card.Meta
        title={`${daysPeriod} days period`}
        description={`Price: ${fromWei(price)} ETH`}
      />
    </Card>
  );
};

export default CardComponent;
