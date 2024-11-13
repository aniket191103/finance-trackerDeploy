import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({ json, param: { id } });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to create transactions');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Transaction Updated");
            queryClient.invalidateQueries({ queryKey: ["transaction",{id}] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });

        },
        onError: () => {
            toast.error("Failed to edit Transaction");
        },
    });

    return mutation;
};
