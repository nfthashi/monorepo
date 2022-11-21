import { Box, BoxProps, Link, Stack, Text } from "@chakra-ui/react";

import configJsonFile from "../../../config.json";

export interface UnitProps extends BoxProps {
  header: string;
  description?: string;
  learnMore?: {
    text: string;
    href: string;
  };
}

export const Unit: React.FC<UnitProps> = ({ children, header, description, learnMore, ...props }) => {
  return (
    <Box
      mx="auto"
      w="full"
      p="4"
      boxShadow={configJsonFile.style.shadow}
      borderRadius={configJsonFile.style.radius}
      bgColor={configJsonFile.style.color.white.bg}
      {...props}
    >
      <Stack spacing="2">
        <Stack spacing="1">
          <Text fontWeight={"bold"} fontSize="lg" color={configJsonFile.style.color.black.text.primary}>
            {header}
          </Text>
          {(description || learnMore) && (
            <Stack spacing="0">
              {description && (
                <Text fontSize="sm" color={configJsonFile.style.color.black.text.secondary}>
                  {description}
                </Text>
              )}
              {learnMore && (
                <Text as={"span"} fontSize="xs" fontWeight={"bold"}>
                  <Link href={learnMore.href} target={"_blank"} color={configJsonFile.style.color.accent}>
                    {learnMore.text}
                  </Link>
                </Text>
              )}
            </Stack>
          )}
        </Stack>
        <Box py="2">{children}</Box>
      </Stack>
    </Box>
  );
};
