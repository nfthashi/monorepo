/* eslint-disable camelcase */
import { Button, useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";

import { Layout } from "@/components/Layout";
import { Modal } from "@/components/Modal";
import { Unit } from "@/components/Unit";

import configJsonFile from "../../config.json";

const HomePage: NextPage = () => {
  const modalDisclosure = useDisclosure();

  return (
    <Layout>
      <Unit header={configJsonFile.name} description={configJsonFile.description}>
        <Button onClick={modalDisclosure.onOpen}>Open Modal</Button>
        <Modal header={"modal header goes here"} onClose={modalDisclosure.onClose} isOpen={modalDisclosure.isOpen}>
          modal content goes here
        </Modal>
      </Unit>
    </Layout>
  );
};

export default HomePage;
