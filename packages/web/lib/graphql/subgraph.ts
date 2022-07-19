import { gql } from "apollo-boost";

const GET_TRANSFER_ID2 = gql`
  {
    originTransfers(where: { transactionHash: "0xe4bb83bf4015d12944c3ebf658095bffae4fa44738809c6c5d959150b2e89a1b" }) {
      transferId
    }
  }
`;


export default GET_TRANSFER_ID2;
