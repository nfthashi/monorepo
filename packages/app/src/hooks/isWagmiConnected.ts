import React from "react";
import { useAccount } from "wagmi";

export const useIsWagmiConnected = () => {
  const [isWagmiConnected, setIsWagmiConnected] = React.useState(false);
  const { isConnected } = useAccount();

  React.useEffect(() => {
    setIsWagmiConnected(isConnected);
  }, [isConnected]);

  return { isWagmiConnected };
};
