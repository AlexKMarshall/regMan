import { useQuery, useMutation, queryCache } from 'react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { client } from './ApiClient';

export function useInstruments() {
  const { getAccessTokenSilently } = useAuth0();

  const { isLoading, error, data, ...instrumentsQuery } = useQuery(
    'instruments',
    client
  );

  const instruments = data || [];

  const [updateInstruments] = useMutation(
    async ({ instruments }) => {
      const token = await getAccessTokenSilently();
      return client('instruments', { method: 'PUT', data: instruments, token });
    },
    {
      onSuccess: (data) => {
        queryCache.setQueryData('instruments', data);
      },
    }
  );

  return {
    isLoading,
    error,
    instruments,
    updateInstruments,
    ...instrumentsQuery,
  };
}
