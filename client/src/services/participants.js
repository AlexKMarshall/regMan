import { useQuery, useMutation, queryCache } from 'react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { client } from './ApiClient';

export function useParticipants() {
  const { getAccessTokenSilently } = useAuth0();

  const { data, ...participantsQuery } = useQuery('participants', async () => {
    const token = await getAccessTokenSilently();
    return client('inscriptions', { token });
  });

  const participants = data ?? [];

  return {
    participants,
    ...participantsQuery,
  };
}

export function useParticipant(participantId) {
  const { getAccessTokenSilently } = useAuth0();

  const { data, ...participantQuery } = useQuery(
    ['participant', participantId],
    async () => {
      const token = await getAccessTokenSilently();
      return client(`inscriptions/${participantId}`, { token });
    }
  );

  const participant = data ?? {};

  return {
    participant,
    ...participantQuery,
  };
}

export function useCreateParticipant() {
  return useMutation(
    async ({ participant }) => {
      return client('inscriptions', { data: participant });
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('participants');
      },
    }
  );
}

export function useUpdateParticipant() {
  const { getAccessTokenSilently } = useAuth0();

  return useMutation(
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
        queryCache.invalidateQueries(['participant', updatedParticipant.id]);
      },
    }
  );
}

export function useDeleteParticipant() {
  const { getAccessTokenSilently } = useAuth0();

  return useMutation(
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
}
