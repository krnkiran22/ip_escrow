import { useState, useEffect, useCallback } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import notificationService from '../services/notificationService';

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('ip_escrow_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTxHash, setCurrentTxHash] = useState(null);

  // Watch for transaction receipt
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: currentTxHash,
    enabled: !!currentTxHash,
  });

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('ip_escrow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Handle transaction confirmation
  useEffect(() => {
    if (receipt && currentTxHash) {
      const tx = transactions.find(t => t.hash === currentTxHash);
      
      if (tx && receipt.status === 'success') {
        updateTransaction(currentTxHash, {
          status: 'confirmed',
          blockNumber: receipt.blockNumber.toString(),
          gasUsed: receipt.gasUsed.toString(),
          confirmedAt: Date.now()
        });

        notificationService.transactionConfirmed(currentTxHash, receipt.blockNumber.toString());
        
        if (tx.onSuccess) {
          tx.onSuccess(receipt);
        }
      } else if (receipt && receipt.status === 'reverted') {
        updateTransaction(currentTxHash, {
          status: 'failed',
          error: 'Transaction reverted',
          failedAt: Date.now()
        });

        notificationService.transactionFailed(currentTxHash, 'Transaction reverted');
        
        if (tx && tx.onError) {
          tx.onError(new Error('Transaction reverted'));
        }
      }

      setCurrentTxHash(null);
    }
  }, [receipt, currentTxHash, transactions]);

  const addTransaction = useCallback((txData) => {
    const transaction = {
      hash: txData.hash,
      type: txData.type,
      description: txData.description,
      status: 'pending',
      createdAt: Date.now(),
      onSuccess: txData.onSuccess,
      onError: txData.onError,
      metadata: txData.metadata || {}
    };

    setTransactions(prev => [transaction, ...prev]);
    setCurrentTxHash(txData.hash);

    // Show pending notification
    notificationService.transactionPending(txData.hash, txData.description);

    return transaction;
  }, []);

  const updateTransaction = useCallback((hash, updates) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.hash === hash 
          ? { ...tx, ...updates }
          : tx
      )
    );
  }, []);

  const getTransaction = useCallback((hash) => {
    return transactions.find(tx => tx.hash === hash);
  }, [transactions]);

  const getPendingTransactions = useCallback(() => {
    return transactions.filter(tx => tx.status === 'pending');
  }, [transactions]);

  const getRecentTransactions = useCallback((count = 5) => {
    return transactions.slice(0, count);
  }, [transactions]);

  const clearTransaction = useCallback((hash) => {
    setTransactions(prev => prev.filter(tx => tx.hash !== hash));
  }, []);

  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
    localStorage.removeItem('ip_escrow_transactions');
  }, []);

  const clearOldTransactions = useCallback((daysOld = 7) => {
    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    setTransactions(prev => 
      prev.filter(tx => 
        tx.status === 'pending' || tx.createdAt > cutoffTime
      )
    );
  }, []);

  // Watch a specific transaction
  const watchTransaction = useCallback((hash) => {
    setCurrentTxHash(hash);
  }, []);

  return {
    transactions,
    currentTransaction: currentTxHash ? getTransaction(currentTxHash) : null,
    isConfirming,
    addTransaction,
    updateTransaction,
    getTransaction,
    getPendingTransactions,
    getRecentTransactions,
    clearTransaction,
    clearAllTransactions,
    clearOldTransactions,
    watchTransaction
  };
}

export default useTransactions;
