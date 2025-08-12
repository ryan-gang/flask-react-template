import { useState, useEffect } from 'react';
import { Account } from 'frontend/types';
import AccountService from 'frontend/services/account.service';

export const useAuthor = (accountId: string) => {
  const [author, setAuthor] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountService = new AccountService();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!accountId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await accountService.getAccountById(accountId);
        if (!response.error && response.data) {
          setAuthor(new Account(response.data as any));
        } else {
          setError(response.error?.message || 'Failed to load author');
        }
      } catch (err) {
        setError('Failed to load author');
        console.error('Error loading author:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [accountId]);

  return { author, isLoading, error };
};
