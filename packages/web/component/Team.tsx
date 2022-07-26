import { Box, Button, Heading, SimpleGrid, useBreakpointValue, useColorModeValue, useTheme } from "@chakra-ui/react";
import * as React from "react";

import teams from "../public/assets/data/teams.json";
import { CardWithAvatar } from "./CardWithAvatar";
import { UserInfo } from "./UserInfo";
import { openWindow } from "./utils/hooks";

export const Team: React.FC = () => {
  const theme = useTheme();
  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")} px={{ base: "6", md: "8" }} py="12">
      <Heading size={useBreakpointValue({ base: "md", md: "lg" })} textAlign="center" py={{ base: 8, md: 16 }}>
        Team
      </Heading>
      <Box as="section" maxW={{ base: "xs", md: "3xl" }} mx="auto">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing="6">
          {teams.map((user) => {
            const { name, bio, src, isVerified } = user;
            return (
              <CardWithAvatar key={name} avatarProps={{ src, name }}>
                <UserInfo mt="4" name={name} bio={bio} isVerified={isVerified} />
                <Button
                  variant="outline"
                  colorScheme={theme.colors.secondary.main}
                  rounded="full"
                  size="sm"
                  width="full"
                  onClick={() => openWindow(user.profile)}
                >
                  View Profile
                </Button>
              </CardWithAvatar>
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
