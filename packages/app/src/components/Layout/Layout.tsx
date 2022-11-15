import { Box, Container, Flex, HStack, Icon, Image, Link, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { FaGithub } from "react-icons/fa";

import { Head } from "@/components/Head";

import configJsonFile from "../../../config.json";

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex minHeight={"100vh"} direction={"column"} bg={configJsonFile.style.color.black.bg}>
      <Head />
      <Container as="section" maxW="8xl">
        <Box as="nav" py="4">
          <Flex justify="space-between" alignItems={"center"} h="16">
            <Link href="/">
              <Image src={"/assets/logo.png"} alt="logo" h="16" />
            </Link>
            <HStack spacing="4">
              <Text color={configJsonFile.style.color.white.text.primary} fontWeight="bold">
                <Link href={configJsonFile.url.docs} target={"_blank"}>
                  Docs
                </Link>
              </Text>
              <Box>
                <ConnectButton accountStatus={"address"} showBalance={false} chainStatus={"name"} />
              </Box>
            </HStack>
          </Flex>
        </Box>
      </Container>
      <Container maxW="2xl" py="4" flex={1}>
        {children}
      </Container>
      <Container maxW="8xl">
        <HStack justify={"space-between"}>
          <Text fontSize={"xs"} color={configJsonFile.style.color.white.text.secondary} fontWeight={"medium"} py="4">
            <Text as="span" mr="2">
              🌉
            </Text>
            <Link href={configJsonFile.url.connext} target={"_blank"}>
              Build with Connext Amarok AMB
            </Link>
          </Text>
          <Link href={configJsonFile.url.github} target={"_blank"}>
            <Icon as={FaGithub} aria-label="github" color={configJsonFile.style.color.white.text.secondary} />
          </Link>
        </HStack>
      </Container>
    </Flex>
  );
};
