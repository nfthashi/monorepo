import {
  Box,
    Container,
  Divider,
  Heading,
  Icon,
  SimpleGrid,
  Square,
  Stack,
  Text,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";
import * as React from "react";

import { usecases } from "../lib/LP/usecases";

export const Usecases: React.FC = () => {
  const theme = useTheme();
  return (
    <Box as="section" bg="bg-surface">
      <Container py={{ base: "16", md: "24" }}>
        <Stack spacing={{ base: "12", md: "16" }}>
          <Stack spacing={{ base: "4", md: "5" }} align="center" textAlign="center">
            <Stack spacing="3">
              <Heading size={useBreakpointValue({ base: "md", md: "lg" })}>What can you build on?</Heading>
            </Stack>
            <Text color="muted" fontSize={{ base: "lg", md: "xl" }} maxW="3xl">
              Cross-Chain NFTs are not yet common, but there is high potential for them and can find new use cases in
              NFTs that did not exist before
            </Text>
          </Stack>
          <Divider mb={12} />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} columnGap={8} rowGap={{ base: 10, md: 16 }}>
            {usecases.map((usecase) => (
              <Stack key={usecase.name} spacing={{ base: "4", md: "5" }} align="center" textAlign="center">
                <Square size={{ base: "10", md: "12" }} bg="accent" color="inverted" borderRadius="lg">
                  <Icon as={usecase.icon} boxSize={{ base: "5", md: "6" }} />
                </Square>
                <Stack spacing={{ base: "1", md: "2" }}>
                  <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="medium" color={theme.colors.secondary.main}>
                    {usecase.name}
                  </Text>
                  <Text color="muted">{usecase.description}</Text>
                </Stack>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
      <Divider mb={12} />
    </Box>
  );
};
