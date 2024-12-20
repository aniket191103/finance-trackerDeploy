import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$delete"]({param: { id } });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to delete transaction');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Transaction deleted");
            queryClient.invalidateQueries({ queryKey: ["transaction",{id}] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });

        },
        onError: () => {
            toast.error("Failed to delete Transaction");
        },
    });

    return mutation;
};
