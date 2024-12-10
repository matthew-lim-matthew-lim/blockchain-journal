'use client'

import { getMyjournaldappProgram, getMyjournaldappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useMyjournaldappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getMyjournaldappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getMyjournaldappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['myjournaldapp', 'all', { cluster }],
    queryFn: () => program.account.myjournaldapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['myjournaldapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ myjournaldapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useMyjournaldappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useMyjournaldappProgram()

  const accountQuery = useQuery({
    queryKey: ['myjournaldapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.myjournaldapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['myjournaldapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ myjournaldapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['myjournaldapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ myjournaldapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['myjournaldapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ myjournaldapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['myjournaldapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ myjournaldapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
