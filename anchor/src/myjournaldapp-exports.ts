// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import MyjournaldappIDL from '../target/idl/myjournaldapp.json'
import type { Myjournaldapp } from '../target/types/myjournaldapp'

// Re-export the generated IDL and type
export { Myjournaldapp, MyjournaldappIDL }

// The programId is imported from the program IDL.
export const MYJOURNALDAPP_PROGRAM_ID = new PublicKey(MyjournaldappIDL.address)

// This is a helper function to get the Myjournaldapp Anchor program.
export function getMyjournaldappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...MyjournaldappIDL, address: address ? address.toBase58() : MyjournaldappIDL.address } as Myjournaldapp, provider)
}

// This is a helper function to get the program ID for the Myjournaldapp program depending on the cluster.
export function getMyjournaldappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Myjournaldapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return MYJOURNALDAPP_PROGRAM_ID
  }
}
