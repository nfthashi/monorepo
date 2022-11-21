import { ethers } from "ethers";

export const getMinimulProxyCreationCodeHash = (implementation: string) => {
  const creation = "0x3d602d80600a3d3981f3";
  const prefix = "0x363d3d373d3d3d363d73";
  const targetBytes = implementation;
  const suffix = "0x5af43d82803e903d91602b57fd5bf3";
  const creationCode = ethers.utils.solidityPack(
    ["bytes10", "bytes10", "bytes20", "bytes15"],
    [creation, prefix, targetBytes, suffix]
  );
  return ethers.utils.keccak256(creationCode);
};

export const getDestinationChainNFTAddress = (
  factory: string,
  implementation: string,
  originalDomainId: number,
  originalAsset: string
) => {
  const salt = ethers.utils.solidityKeccak256(["uint32", "address"], [originalDomainId, originalAsset]);
  const creationCodeHash = getMinimulProxyCreationCodeHash(implementation);
  return ethers.utils.getCreate2Address(factory, salt, creationCodeHash);
};
