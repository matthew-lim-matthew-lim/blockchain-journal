import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Myjournaldapp} from '../target/types/myjournaldapp'

describe('myjournaldapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Myjournaldapp as Program<Myjournaldapp>

  const myjournaldappKeypair = Keypair.generate()

  it('Initialize Myjournaldapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        myjournaldapp: myjournaldappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([myjournaldappKeypair])
      .rpc()

    const currentCount = await program.account.myjournaldapp.fetch(myjournaldappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Myjournaldapp', async () => {
    await program.methods.increment().accounts({ myjournaldapp: myjournaldappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myjournaldapp.fetch(myjournaldappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Myjournaldapp Again', async () => {
    await program.methods.increment().accounts({ myjournaldapp: myjournaldappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myjournaldapp.fetch(myjournaldappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Myjournaldapp', async () => {
    await program.methods.decrement().accounts({ myjournaldapp: myjournaldappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myjournaldapp.fetch(myjournaldappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set myjournaldapp value', async () => {
    await program.methods.set(42).accounts({ myjournaldapp: myjournaldappKeypair.publicKey }).rpc()

    const currentCount = await program.account.myjournaldapp.fetch(myjournaldappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the myjournaldapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        myjournaldapp: myjournaldappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.myjournaldapp.fetchNullable(myjournaldappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
