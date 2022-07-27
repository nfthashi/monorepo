import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Divider, Heading, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import config from "../../contracts/networks.json";
import { Chain } from "../../contracts/types/chain";
import { getNetworkFromChainId } from "../lib/web3";
import { truncate } from "./utils/truncate";

export const OrderHistory: React.FC = () => {
  const { account } = useWeb3React<Web3Provider>();

  const getTxHistory = () => {
    let array = [];
    if (account && typeof window !== "undefined") {
      if (window.localStorage) {
        const pastJson = localStorage.getItem(account);
        if (pastJson) {
          array = JSON.parse(pastJson);
        }
      }
    }
    return array;
  };

  const data = getTxHistory();

  console.log(account);

  return (
    <Box>
      {account && (
        <Box mt="10px">
          <Divider mb={12} />
          <Heading fontSize={{ base: "xl", md: "2xl" }} px="2px" textAlign={"center"}>
            Bridge History
          </Heading>
          <TableContainer mt="10">
            <Table size="sm">
              <Thead>
                <Tr textAlign={"center"}>
                  <Th>Index</Th>
                  <Th>Transaction Hash</Th>
                  <Th>Connextscan</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((d: [string, string, number], index: number) => {
                  const chainName: Chain = getNetworkFromChainId(d[2]);
                  if (!chainName) {
                    console.log("no network name");
                    return;
                  }
                  return (
                    <Tr key={d[0]}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <Link href={`${config[chainName].explorer}tx/${d[0]}`} isExternal>
                          {truncate(d[0], 5, 5)}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>
                      <Td>
                        <Link href={`https://testnet.amarok.connextscan.io/tx/${d[1]}`} isExternal>
                          {truncate(d[1], 5, 5)}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};
