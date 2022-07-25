import { ApolloClient, InMemoryCache } from "@apollo/client";

export const clients = {
  rinkeby: new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-rinkeby",
    cache: new InMemoryCache(),
  }),
  goerli: new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-goerli",
    cache: new InMemoryCache(),
  }),
  kovan: new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-kovan",
    cache: new InMemoryCache(),
  }),
};