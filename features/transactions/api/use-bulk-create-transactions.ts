import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>;

export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (data) => {
            // Pass `data` directly as an array
            const response = await client.api.transactions["bulk-create"]["$post"](data);

            if (!response.ok) {
                throw new Error('Failed to create transactions');
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("Transactions created successfully");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
        },
        onError: () => {
            toast.error("Failed to create transactions");
        },
    });

    return mutation;
};
