import Head from "next/head";

export const Seo = () => {
  return (
    <Head>
      <title>xNFTs</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta property="og:url" content="https://xnfts.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="xNFTs" />
      <meta property="og:site_name" content="xNFTs" />
      <meta property="og:description" content="Cross-chain NFT Bridge powered by Connext" />
      <meta property="og:image" content="https://xnfts.vercel.app/assets/thumbnail.png" />
    </Head>
  );
};
