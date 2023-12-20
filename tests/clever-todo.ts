import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CleverTodo } from "../target/types/clever_todo";
import "dotenv";
import { configDotenv } from "dotenv";
import { PublicKey } from "@solana/web3.js";
configDotenv();

describe("clever-todo", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const authoritySecretKey = process.env.SECRET_KEY;

  const authority = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(authoritySecretKey, "hex"))
  );
  const program = anchor.workspace.CleverTodo as Program<CleverTodo>;

  const USER_TAG = "USER_STATE";

  it("Is initialized!", async () => {
    const [userAccountAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("USER_STATE"), authority.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .initializeUser()
      .accounts({
        authority: authority.publicKey,
        userProfile: userAccountAddress,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
