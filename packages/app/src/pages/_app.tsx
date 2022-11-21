import "@rainbow-me/rainbowkit/styles.css";
import "@fontsource/inter";

import { ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { WagmiConfig } from "wagmi";

import { myChakraUITheme, myRainbowKitTheme } from "@/lib/theme";
import { chains, wagmiClient } from "@/lib/wallet";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <ChakraProvider resetCSS theme={myChakraUITheme}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider coolMode chains={chains} theme={myRainbowKitTheme}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default MyApp;
