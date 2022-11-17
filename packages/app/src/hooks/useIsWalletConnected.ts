import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useIsWalletConnected = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isConnected]);

  return { isWalletConnected };
};
