import { BoxProps, Divider, Stack, Text } from "@chakra-ui/react";

import configJsonFile from "../../../config.json";
import { StepCircle } from "./StepCircle";

export interface StepProps extends BoxProps {
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isTxProcessing: boolean;
  isLastStep: boolean;
}

export const Step: React.FC<StepProps> = ({
  isCompleted,
  isActive,
  isTxProcessing,
  isLastStep,
  title,
  description,
  ...stackProps
}) => {
  return (
    <Stack spacing="6" direction="row" {...stackProps}>
      <Stack spacing="0" align="center">
        <StepCircle isCompleted={isCompleted} isActive={isActive} isTxProcessing={isTxProcessing} />
        <Divider
          orientation="vertical"
          borderWidth="1px"
          borderColor={isLastStep ? "transparent" : isCompleted ? "accent" : "inherit"}
        />
      </Stack>
      <Stack spacing="0" pb={isLastStep ? "0" : "8"}>
        <Text color={configJsonFile.style.color.black.text.secondary} fontSize="sm" fontWeight="bold">
          {title}
        </Text>
        <Text color={configJsonFile.style.color.black.text.tertiary} fontSize="xs">
          {description}
        </Text>
      </Stack>
    </Stack>
  );
};
