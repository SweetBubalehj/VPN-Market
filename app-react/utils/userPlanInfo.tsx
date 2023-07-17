import { useContractRead } from "wagmi";
import { ABI, contractAddress } from "../contract/VPNmarket";

export const usePlanEndTime = (userAddress: any) => {
  const { data: userPlanData } = useContractRead({
    address: contractAddress,
    abi: ABI,
    functionName: "addressToPlan",
    args: [userAddress],
  });

  console.log(userPlanData);

  let planEndTIme: number = 0;

  if (userPlanData != undefined) {
    planEndTIme = Number(userPlanData[2]);
  }

  return planEndTIme;
};
