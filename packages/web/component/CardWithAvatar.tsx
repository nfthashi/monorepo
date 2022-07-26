import { Avatar, AvatarProps, Box, Flex, FlexProps, useColorModeValue, useTheme } from "@chakra-ui/react";
import * as React from "react";

interface CardWithAvatarProps extends FlexProps {
  avatarProps: AvatarProps;
}

export const CardWithAvatar = (props: CardWithAvatarProps) => {
    const { children, avatarProps, ...rest } = props;
    const theme = useTheme();
  return (
    <Flex
      direction="column"
      alignItems="center"
      rounded="md"
      padding="8"
      position="relative"
      bg={useColorModeValue("white", "gray.700")}
      shadow={{ md: "base" }}
      {...rest}
    >
      <Box position="absolute" inset="0" height="20" bg={theme.colors.secondary.main} roundedTop="inherit" />
      <Avatar size="xl" {...avatarProps} />
      {children}
    </Flex>
  );
};
