import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Web3ReactProvider } from "@web3-react/core";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";

function MyApp({ Component, pageProps }: AppProps) {
  function getLibrary(provider: any) {
    return new Web3Provider(provider);
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
