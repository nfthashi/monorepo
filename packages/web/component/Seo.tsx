import Head from "next/head";

export const Seo = () => {
  return (
    <Head>
      <title>xNFTs</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta property="og:url" content="https://nfthashi.com" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="NFTHashi" />
      <meta property="og:site_name" content="NFTHashi" />
      <meta property="og:description" content="Trust minimized cross-chain NFT Bridge powered by Connext Amarok" />
      <meta property="og:image" content="https://nfthashi.com/assets/banner.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};
