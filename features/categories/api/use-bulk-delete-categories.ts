import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = { ids: string[] }; // Ensure this matches the expected type.

export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (data) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({ json: data }); // Directly pass `data` as the `json` value.

            if (!response.ok) {
                throw new Error('Failed to delete categories');
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("Categories deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: () => {
            toast.error("Failed to delete categories");
        },
    });

    return mutation;
};
