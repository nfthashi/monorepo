import React from "react";
import { Flex, Text } from "@chakra-ui/react";
export const Footer: React.FC = () => {
  return (
    <Flex minH={"64px"} alignItems={"center"} justifyContent={"center"} p={{ base: 4 }} gap={"16px"}>
      <Text fontSize={"xs"} fontWeight={"medium"}>
        xNFTs@2022
      </Text>
    </Flex>
  );
};
