import React from "react";

import { Box, Flex, Text, Button } from "@chakra-ui/react";
// import Web3Modal from "web3modal";
import Web3 from "web3";
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import { useRecoilState } from "recoil";

// import { accountState } from "../atoms/account";

export const Header: React.FC = () => {
  // const [account, setAccount] = useRecoilState(accountState);

  const connect = async () => {
    // try {
    //   const providerOptions = {
    //     walletconnect: {
    //       package: WalletConnectProvider,
    //       options: {
    //         infuraId: "95f65ab099894076814e8526f52c9149", // required
    //       },
    //     },
    //   };
    //   const web3Modal = new Web3Modal({
    //     network: "mainnet", // optional
    //     providerOptions, // required
    //   });
    //   const provider = await web3Modal.connect();
    //   const web3 = new Web3(provider);
    //   const [account] = await web3.eth.getAccounts();
    //   setAccount(account);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  return (
    <Box>
      <Flex minH={"64px"} alignItems={"center"} justifyContent={"space-between"} p={{ base: 8 }}>
        <Text fontSize={"lg"} fontWeight={"bold"}>
          xNFTs
        </Text>
        <Flex gap={"16px"}>
          {/* {!account ? (
            <Button onClick={connect} fontSize={"xs"}>
              Connect Wallet
            </Button>
          ) : (
            <Button fontSize={"xs"}>{account}</Button>
          )} */}
        </Flex>
      </Flex>
    </Box>
  );
};
