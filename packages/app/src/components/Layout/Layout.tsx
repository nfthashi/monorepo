import { Box, Container, Flex, HStack, Icon, Image, Link, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { MdArticle } from "react-icons/md";

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
          <HStack justify="space-between" alignItems={"center"} h="12">
            <Link href="/">
              <Image src={"/assets/logo.png"} alt="logo" h="12" />
            </Link>
            <Box>
              <ConnectButton accountStatus={"address"} showBalance={false} chainStatus={"icon"} />
            </Box>
          </HStack>
        </Box>
      </Container>
      <Container maxW="lg" py="4" flex={1}>
        {children}
      </Container>
      <Container maxW="8xl">
        <Box as="nav" py="4">
          <HStack justify={"space-between"}>
            <Text fontSize={"xs"} color={configJsonFile.style.color.white.text.secondary} fontWeight={"medium"}>
              <Text as="span" mr="2">
                😘
              </Text>
              Built with{" "}
              <Link href={configJsonFile.url.connext} target={"_blank"}>
                Connext Network
              </Link>
            </Text>
            <HStack spacing={"4"}>
              <Link href={configJsonFile.url.docs} target={"_blank"}>
                <Icon
                  as={MdArticle}
                  aria-label="article"
                  color={configJsonFile.style.color.white.text.tertiary}
                  w={5}
                  h={5}
                />
              </Link>
              <Link href={configJsonFile.url.twitter} target={"_blank"}>
                <Icon
                  as={FaTwitter}
                  aria-label="twitter"
                  color={configJsonFile.style.color.white.text.tertiary}
                  w={5}
                  h={5}
                />
              </Link>
              <Link href={configJsonFile.url.discord} target={"_blank"}>
                <Icon
                  as={FaDiscord}
                  aria-label="discord"
                  color={configJsonFile.style.color.white.text.tertiary}
                  w={5}
                  h={5}
                />
              </Link>
              <Link href={configJsonFile.url.github} target={"_blank"}>
                <Icon
                  as={FaGithub}
                  aria-label="github"
                  color={configJsonFile.style.color.white.text.tertiary}
                  w={5}
                  h={5}
                />
              </Link>
            </HStack>
          </HStack>
        </Box>
      </Container>
    </Flex>
  );
};
