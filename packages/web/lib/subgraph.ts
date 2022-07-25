import { gql } from "apollo-boost";

const GET_TRANSFERS_ID = (txHash: string) => { 
   return gql`
      {
        originTransfers(where: { transactionHash: "${txHash}" }) {
          transferId
        }
      }
    `;
}

export default GET_TRANSFERS_ID;
