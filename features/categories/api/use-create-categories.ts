import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to create categories');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Category Created");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to create Category");
        },
    });

    return mutation;
};
