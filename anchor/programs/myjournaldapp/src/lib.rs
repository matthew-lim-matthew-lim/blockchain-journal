#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod myjournaldapp {
    use super::*;

  pub fn close(_ctx: Context<CloseMyjournaldapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.myjournaldapp.count = ctx.accounts.myjournaldapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.myjournaldapp.count = ctx.accounts.myjournaldapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeMyjournaldapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.myjournaldapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeMyjournaldapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Myjournaldapp::INIT_SPACE,
  payer = payer
  )]
  pub myjournaldapp: Account<'info, Myjournaldapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseMyjournaldapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub myjournaldapp: Account<'info, Myjournaldapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub myjournaldapp: Account<'info, Myjournaldapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Myjournaldapp {
  count: u8,
}
