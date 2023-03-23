const { Wallet, PrivateKey, AccountCreateTransaction, Hbar, LocalProvider } = require("@hashgraph/sdk");
const dotenv = require("dotenv");
  
dotenv.config();

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

async function main() {
  const wallet = new Wallet(myAccountId, myPrivateKey, new LocalProvider());

  for (let i = 1; i <= 5; i++) {
    const newKey = PrivateKey.generate();

    console.log(`PRIVATE_KEY_${i} = ${newKey.toString()}`);
    console.log(`PUBLIC_KEY_${i} = ${newKey.publicKey.toString()}`);

    let transaction = await new AccountCreateTransaction()
      .setInitialBalance(new Hbar(500))
      .setKey(newKey.publicKey)
      .freezeWithSigner(wallet);

    transaction = await transaction.signWithSigner(wallet);

    const response = await transaction.executeWithSigner(wallet);

    const receipt = await response.getReceiptWithSigner(wallet);

    console.log(`ACCOUNT_ID_${i} = ${receipt.accountId.toString()}` + "\n");
  }
}

main().catch((err) => console.error(err));
