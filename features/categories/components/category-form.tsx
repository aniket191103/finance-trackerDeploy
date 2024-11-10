import { Trash } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = insertCategorySchema.pick({
    
    
    
    
    
    name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

export const CategoryForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues, // Assign `defaultValues` directly here
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    };

    const handleDelete =()=>{
        onDelete?.();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Eg : Food , Travel ,etc." disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button  disabled={disabled} className="w-full">
                    {id ? "Save Changes" : "Create Category"}
                </Button>

                {!!id&&<Button
                type="button"
                disabled={disabled}
                onClick={handleDelete}
                className="w-full "
                variant="outline"
                >
                    <Trash className="size-4 mr-2"/>

                    Delete Category!
                </Button>}
            </form>
        </Form>
    );
};
