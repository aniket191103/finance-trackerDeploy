import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = { ids: string[] }; // Ensure this matches the expected type.

export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (data) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json: data }); // Directly pass `data` as the `json` value.

            if (!response.ok) {
                throw new Error('Failed to delete accounts');
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("Accounts deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: () => {
            toast.error("Failed to delete accounts");
        },
    });

    return mutation;
};
