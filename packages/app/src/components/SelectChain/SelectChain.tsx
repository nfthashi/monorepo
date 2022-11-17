import { FormControl, Select, SelectProps, Stack, Text } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";

import networkJsonFile from "../../../../contracts/network.json";
import { ChainId } from "../../../../contracts/types/ChainId";
import configJsonFile from "../../../config.json";

export interface SelectChain extends SelectProps {
  type: "origin" | "destination";
  value: ChainId;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
}

export const SelectChain: React.FC<SelectChain> = ({ type, value, onChange, disabled }) => {
  return (
    <Stack>
      <Text color={configJsonFile.style.color.black.text.secondary} fontSize="sm" fontWeight="bold">
        {type === "origin" ? "Origin" : "Destination"}
      </Text>
      <FormControl>
        <Select
          rounded={configJsonFile.style.radius}
          boxShadow={configJsonFile.style.shadow}
          color={configJsonFile.style.color.black.text.secondary}
          value={value}
          disabled={disabled}
          onChange={onChange}
        >
          {Object.entries(networkJsonFile).map(([chainId, network]) => {
            return (
              <option key={`select_${type}_${chainId}`} value={chainId}>
                {network.name}
              </option>
            );
          })}
        </Select>
      </FormControl>
    </Stack>
  );
};
