import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useIsWagmiConnected = () => {
  const [isWagmiConnected, setIsWagmiConnected] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setIsWagmiConnected(isConnected);
  }, [isConnected]);

  return { isWagmiConnected };
};
