import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({ json, param: { id } });
            if (!response.ok) {
                // Throw an error for react-query to handle it in onError.
                throw new Error('Failed to create category');
            }
            return (await response.json()) as ResponseType;
        },
        onSuccess: () => {
            toast.success("Category Updated");
            queryClient.invalidateQueries({ queryKey: ["categories",{id}] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });

        },
        onError: () => {
            toast.error("Failed to edit category");
        },
    });

    return mutation;
};
