import "../styles/globals.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";

import theme from "../lib/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-goerli",
  });
  function getLibrary(provider: ExternalProvider) {
    return new Web3Provider(provider, "any");
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider theme={theme}>
        <ApolloProvider client={client}>
        <Component {...pageProps} />

        </ApolloProvider>
      </ChakraProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
