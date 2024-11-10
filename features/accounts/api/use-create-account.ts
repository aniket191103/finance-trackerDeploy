import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({ json });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to create account');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Account Created");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: () => {
            toast.error("Failed to create Account");
        },
    });

    return mutation;
};
