import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$delete"]({param: { id } });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to delete account');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Account deleted");
            queryClient.invalidateQueries({ queryKey: ["accounts",{id}] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });

        },
        onError: () => {
            toast.error("Failed to delete Account");
        },
    });

    return mutation;
};
