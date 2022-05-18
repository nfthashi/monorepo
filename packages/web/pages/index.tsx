import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Flex, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import Native from "./component/Native";
import Wrapper from "./component/Wrapper";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  return (
    <div>
      <main>
        <Flex mr="10" ml="10">
          <Spacer></Spacer>
          <Wrapper></Wrapper>
          <Native></Native>
          <Spacer></Spacer>
        </Flex>
      </main>
    </div>
  );
};

export default Home;
