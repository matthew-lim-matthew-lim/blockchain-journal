#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("ETri6VFqH1Yhx2iJ7CmftWyj5wFytBHWJ9Fh1WvESeHt");

// This is the instruction handler. It is a function that is called when the instruction is invoked.
#[program]
pub mod journal {
  use super::*;

  // Each journal entry has its own PDA. Every new entry means new account initialised on-chain.
  // With Anchor, every instruction takes a Context type as its first argument. Context macro is used to define a struct 
  // that contains all the accounts that will be passed through a given instruction handler.
  pub fn create_entry(
    ctx: Context<CreateEntry>,  // CreateEntry is a custom data structure for this instruction.
    title: String, // Save the title and message to the journal entry state of this PDA.
    message: String, 
  ) -> Result<()> {
    let journal_entry = &mut ctx.accounts.journal_entry; // Get the journal entry account.
    journal_entry.owner = ctx.accounts.owner.key();
    journal_entry.title = title;
    journal_entry.message = message; 

    return Ok(());
  }

  pub fn update_entry(
    ctx: Context<UpdateEntry>,
    _title: String,  // Title is still required, as it is used to derive the PDA.
    new_message: String,
  ) -> Result<()> {
    let journal_entry = &mut ctx.accounts.journal_entry; // Get the journal entry account.
    journal_entry.message = new_message;

    return Ok(());
  }

  pub fn delete_entry(
    _ctx: Context<DeleteEntry>,
    _title: String,
  ) -> Result<()> {
    return Ok(());
  }
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
#[instruction(title: String)] // Instruction macro allows data to be passed past the instruction handler.
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

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateEntry<'info> {
  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump, 
    realloc = 8 + JournalEntryState::INIT_SPACE,  // Reallocate the space for the account.
    realloc::payer = owner, // Pay additional rent needed, or refunded if message size shrinks.
    realloc::zero = true, // Space is reset to 0 before space rquired is recaclulated.
  )]
  pub journal_entry: Account<'info, JournalEntryState>,
  #[account(mut)] 
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
  #[account(
    mut,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump, 
    close = owner,  // If the owner runs the function, close the account.
  )]
  pub journal_entry: Account<'info, JournalEntryState>,
  #[account(mut)] 
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}