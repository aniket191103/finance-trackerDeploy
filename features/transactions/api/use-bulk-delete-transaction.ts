import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = { ids: string[] }; // Ensure this matches the expected type.

export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (data) => {
            const response = await client.api.transactions["bulk-delete"]["$post"]({ json: data }); // Directly pass `data` as the `json` value.

            if (!response.ok) {
                throw new Error('Failed to delete transactions');
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("Transactions deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
        onError: () => {
            toast.error("Failed to delete transactions");
        },
    });

    return mutation;
};
