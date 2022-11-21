import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useIsWalletConnected = () => {
  const { isConnected, address: connectedAddress } = useAccount();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);

  return { isWalletConnected, connectedAddress };
};
