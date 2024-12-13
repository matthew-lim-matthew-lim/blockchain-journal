#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod journal {
  user super::*;

  // Each journal entry has its own PDA. Every new entry means new account initialised on-chain.
  // With Anchor, every instruction takes a Context type as its first argument. Context macro is used to define a struct 
  // that contains all the accounts that will be passed through a given instruction handler.
  pub fn create_entry(
    ctx: Context<CreateEntry>,  // CreateEntry is a custom data structure for this instruction.
  )
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
  pub owner: Pubkey,
  #[max_len(20)]
  pub title: String,
  #[max_len(2000)]
  pub message: String,
  pub entry_id: u64,  // Helpful for indexing on FE
}

// Deserialise and validate the list of accounts specified within the struct. 
#[derive(Accounts)]
#[instruction(title: String)] // Instruction macro allows data to be passed past the instruction handler
pub struct CreateEntry<'info> {
  #[account(
    init,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    payer = owner, 
    space = 8 + JournalEntryState::INIT_SPACE,
  )]
  // Define the account that will be created by this instruction.
  pub journal_entry: Account<'info, JournalEntryState>,
  #[account(mut)] // The account is mutable because the owner will be making a payment.
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}