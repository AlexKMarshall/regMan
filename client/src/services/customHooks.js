import { useQuery, useMutation, queryCache } from 'react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { client } from './ApiClient';

export function useInstruments() {
  const { getAccessTokenSilently } = useAuth0();

  const { data, ...instrumentsQuery } = useQuery('instruments', client);

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
    instruments,
    updateInstruments,
    ...instrumentsQuery,
  };
}

export function useParticipants() {
  const { getAccessTokenSilently } = useAuth0();

  const { data, ...participantsQuery } = useQuery('participants', async () => {
    const token = await getAccessTokenSilently();
    return client('inscriptions', { token });
  });

  const participants = data || [];

  const [updateParticipant] = useMutation(
    async ({ participant }) => {
      const token = await getAccessTokenSilently();
      return client(`inscriptions/update/${participant.id}`, {
        method: 'PUT',
        token,
        data: participant,
      });
    },
    {
      onSuccess: (updatedParticipant) => {
        queryCache.invalidateQueries('participants');
      },
    }
  );

  const [deleteParticipant] = useMutation(
    async ({ participantId }) => {
      const token = await getAccessTokenSilently();
      return client(`inscriptions/delete/${participantId}`, {
        method: 'PUT',
        token,
      });
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('participants');
      },
    }
  );

  const [createParticipant] = useMutation(
    async ({ participant }) => {
      return client('inscriptions', { data: participant });
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('participants');
      },
    }
  );

  return {
    participants,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    ...participantsQuery,
  };
}
