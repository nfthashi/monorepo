import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Divider, Heading, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { getNetworkFromChainId } from "../lib/web3";

export const OrderHistory: React.FC = () => {
  const { account } = useWeb3React<Web3Provider>();

  const getTxHistories = () => {
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

  const data = getTxHistories();

  console.log(account);

  return (
    <Box>
      {account && (
        <Box mt="10px">
          <Divider mb={12} />
          <Heading fontSize={{ base: "xl", md: "3xl" }} px="2px">
            Bridge Histories
          </Heading>
          <TableContainer>
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
                  const chainName = getNetworkFromChainId(d[2]);
                  const chaineExplorer = "https://" + chainName + ".etherscan.io/tx/" + d[0];
                  const ConnextScan = "https://testnet.amarok.connextscan.io/tx/" + d[1];
                  return (
                    <Tr key={d[0]}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <Link href={chaineExplorer} isExternal>
                          {d[0]}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>
                      <Td>
                        <Link href={ConnextScan} isExternal>
                          {d[1]}
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
