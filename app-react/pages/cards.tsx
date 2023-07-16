import { Card, Button, notification } from "antd";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ABI, contractAddress } from "../contract/VPNmarket";


type CardProps = {
  id: number;
  imageSrc: string;
  title: string;
  isConnected: boolean;
};

const CardComponent: React.FC<CardProps> = ({
  id,
  imageSrc,
  title,
  isConnected,
}) => {
  const [editionsRemaining, setEditionsRemaining] = useState<number>();

  const { data: ntfIdToSupply } = useContractRead({
    address: contractAddress as any,
    abi: ABI,
    functionName: "nftToSupply",
    args: [id],
  });

  useEffect(() => {
    if (ntfIdToSupply !== undefined) {
      setEditionsRemaining(10 - Number(ntfIdToSupply));
    }
  }, [ntfIdToSupply]);

  const transactionIsSuccess = () => {
    notification.success({
      message: "Transaction successful",
      placement: "bottomRight",
    });
  };

  const transactionIsLoading = () => {
    notification.warning({
      message: "Check your wallet",
      placement: "bottomRight",
    });
  };

  const { config: buyNFT } = usePrepareContractWrite({
    address: contractAddress as any,
    abi: ABI,
    functionName: "buyNFT",
    args: [id],
    overrides: {
      value: ethers.utils.parseEther("0.001"),
    },
  });

  const { isLoading, isSuccess, write: buy } = useContractWrite(buyNFT);

  useEffect(() => {
    if (isLoading) {
      transactionIsLoading();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSuccess) {
      transactionIsSuccess();
    }
  }, [isSuccess]);

  return (
    <CardWrapper
      cover={<img alt="product" src={imageSrc} />}
      actions={[
        <Button
          style={{ width: "150px" }}
          type="primary"
          size="large"
          key="buy-now"
          disabled={
            isConnected &&
            editionsRemaining !== undefined &&
            editionsRemaining > 0
              ? false
              : true
          }
          onClick={() => buy?.()}
        >
          {editionsRemaining !== undefined && editionsRemaining > 0
            ? "Buy Now"
            : "Sold out"}
        </Button>,
      ]}
    >
      <Card.Meta
        title={title}
        description={
          editionsRemaining !== undefined
            ? `Editions remaining: ${editionsRemaining} | Price: 0.001 BNB`
            : "Loading..."
        }
      />
    </CardWrapper>
  );
};

export default CardComponent;