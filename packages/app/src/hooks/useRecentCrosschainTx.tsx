import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";

export type TxStatus = "processing" | "failed" | "confirmed";
export interface Tx {
  hash: string;
  status: TxStatus;
}

const recentCrosschainTxListForAllAddressState = atom<{ [userAddress: string]: Tx[] }>({
  key: "recentCrosschainTxListForAllAddressState",
  default: {},
});

export const useRecentCrosschainTx = (userAddress?: string) => {
  const recentCrosschainTxStorageKey = "recentCrosschainTxStorageKey";

  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  const [recentCrosschainTxListForAllAddress, setRecentCrosschainTxListForAllAddress] = useRecoilState(
    recentCrosschainTxListForAllAddressState
  );
  const [recentCrosschainTxList, setRecentCrosschainTxList] = useState<Tx[]>([]);

  const clearRecentCrosschainTx = () => {
    if (!userAddress) {
      throw new Error("user address not set");
    }
    const updated = {
      ...recentCrosschainTxListForAllAddress,
      [userAddress]: [],
    };
    setRecentCrosschainTxListForAllAddress(updated);
    window.localStorage.setItem(recentCrosschainTxStorageKey, JSON.stringify(updated));
  };

  const addRecentCrosschainTx = (hash: string) => {
    if (!userAddress) {
      throw new Error("user address not set");
    }
    const updated = {
      ...recentCrosschainTxListForAllAddress,
      [userAddress]: [
        ...(recentCrosschainTxListForAllAddress[userAddress] ? recentCrosschainTxListForAllAddress[userAddress] : []),
        { hash, status: "processing" as TxStatus },
      ],
    };
    setRecentCrosschainTxListForAllAddress(updated);
    window.localStorage.setItem(recentCrosschainTxStorageKey, JSON.stringify(updated));
  };

  useEffect(() => {
    if (!userAddress || isLocalStorageLoaded) {
      return;
    }
    setIsLocalStorageLoaded(true);
    const recentCrosschainTxStorage = window.localStorage.getItem(recentCrosschainTxStorageKey);
    if (!recentCrosschainTxStorage) {
      return;
    }
    const record = JSON.parse(recentCrosschainTxStorage);
    setRecentCrosschainTxListForAllAddress(record);
    if (!record[userAddress]) {
      return;
    }
    setRecentCrosschainTxList(record[userAddress]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRecentCrosschainTxListForAllAddress, userAddress]);

  return { recentCrosschainTxList, addRecentCrosschainTx, clearRecentCrosschainTx };
};
