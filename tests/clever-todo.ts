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

  const TODO_TAG = "TODO_STATE";
  const lastTodoAsU8 = new Uint8Array([0]);

  it("Adds a todo", async () => {
    const [userAccountAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from(USER_TAG), authority.publicKey.toBuffer()],
      program.programId
    );

    const [todoAccountAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from(TODO_TAG), authority.publicKey.toBuffer(), lastTodoAsU8],
      program.programId
    );

    const tx = await program.methods
      .addTodo("first Todo")
      .accounts({
        userProfile: userAccountAddress,
        todoAccount: todoAccountAddress,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc();
    console.log("Your txn is :", tx);
  });

  const todoIdx = 0;

  it("marks a todo", async () => {
    const [userAccountAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from(USER_TAG), authority.publicKey.toBuffer()],
      program.programId
    );

    const [todoAccountAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from(TODO_TAG), authority.publicKey.toBuffer(), lastTodoAsU8],
      program.programId
    );

    const tx = await program.methods
      .markTodo(todoIdx)
      .accounts({
        userProfile: userAccountAddress,
        todoAccount: todoAccountAddress,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc();
    console.log("Your txn is :", tx);
  });

  const todoIdxToRemove = 0;
  it("removes a todo", async () => {
    const [userAccountAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from(USER_TAG), authority.publicKey.toBuffer()],
      program.programId
    );

    const [todoAccountAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from(TODO_TAG), authority.publicKey.toBuffer(), lastTodoAsU8],
      program.programId
    );

    const tx = await program.methods
      .removeTodo(todoIdxToRemove)
      .accounts({
        userProfile: userAccountAddress,
        todoAccount: todoAccountAddress,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authority])
      .rpc();
    console.log("Your txn is :", tx);
  });
});

