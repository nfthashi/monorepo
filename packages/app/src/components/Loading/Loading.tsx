import { Box, BoxProps, Center, Spinner } from "@chakra-ui/react";

import configJsonFile from "../../../config.json";

export interface LoadingProps extends BoxProps {
  h?: number | string;
}

export const Loading: React.FC<LoadingProps> = ({ h = 400, ...boxProps }) => {
  return (
    <Box {...boxProps} h={h}>
      <Center h={"full"} w="full">
        <Spinner color={configJsonFile.style.color.accent} />
      </Center>
    </Box>
  );
};
