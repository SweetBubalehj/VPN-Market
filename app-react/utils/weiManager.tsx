import { ethers } from "ethers";

export const toWei = (value: any) => ethers.utils.parseEther(value.toString());

export const fromWei = (value: any) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );
