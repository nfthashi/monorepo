import { useToast } from "@chakra-ui/react";

export const useSuccessHandler = () => {
  const toast = useToast();
  const handleSuccess = (description: string) => {
    console.log(description);
    toast({
      title: `Sucess`,
      description,
      status: "success",
      position: "top-right",
      duration: 10000,
      isClosable: true,
    });
  };
  return { handleSuccess };
};
