import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$delete"]({param: { id } });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to delete category');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ["categories",{id}] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });


        },
        onError: () => {
            toast.error("Failed to delete Category");
        },
    });

    return mutation;
};
