import fs from "fs";

export const getMnemonic = () => {
  const mnemonicFileName = "../../../../mnemonic.txt";
  let mnemonic = "test ".repeat(11) + "junk";
  if (fs.existsSync(mnemonicFileName)) {
    mnemonic = fs.readFileSync(mnemonicFileName, "ascii").trim();
  }
  return mnemonic;
};
