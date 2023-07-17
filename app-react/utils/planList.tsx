import { useContractRead } from "wagmi";
import { ABI, contractAddress } from "../contract/VPNmarket";

export type Plan = {
  price: number;
  period: number;
};

export const usePlanList = () => {
  const { data: planListData } = useContractRead({
    address: contractAddress,
    abi: ABI,
    functionName: "getPlanList",
  });

  let PlanArray: Plan[] = [];

  if (
    planListData &&
    Array.isArray(planListData) &&
    planListData.length === 2
  ) {
    const prices = planListData[0] as number[];
    const periods = planListData[1] as number[];

    PlanArray = prices.map((price, index) => {
      return { price: price, period: periods[index] };
    });
  }

  return PlanArray;
};
