import * as ecc from 'tiny-secp256k1';
import secp256k1 from '@vulpemventures/secp256k1-zkp';
import { Contract, networks } from '@ionio-lang/ionio';
import { artifact, myself, to, amount, fundingUtxo, prevout, broadcast } from './somewhere';
const zkp = await secp256k1();

const feeAmount = 100;

const contract = new Contract(artifact, [3], networks.regtest, { ecc, zkp });

// attach to the funded contract using the utxo
const instance = contract.from(
  fundingUtxo.txid,
  fundingUtxo.vout,
  fundingUtxo.prevout
);

const tx = instance.functions
  .sumMustBeThree(1, 2)
  .withRecipient(to, amount, networks.regtest)
  .withRecipient(
    myself,
    utxo.value - amount - feeAmount,
    network.assetHash
  )
  .withFeeOutput(feeAmount);


// Finalize the transaction, checking for all requirements to be satisfied.
// In this case we do not need a signature to unlock the funds
// In case of signature needed, unlock accepts an optional parameter of Signer interface
const signedTx = await tx.unlock();

// extract and broadcast
const extractedTx = signedTx.psbt.extractTransaction().toHex();
const txid = await broadcast(extractedTx);
