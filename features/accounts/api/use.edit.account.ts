import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({ json, param: { id } });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to create account');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Account Updated");
            queryClient.invalidateQueries({ queryKey: ["accounts",{id}] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });


        },
        onError: () => {
            toast.error("Failed to edit Account");
        },
    });

    return mutation;
};
