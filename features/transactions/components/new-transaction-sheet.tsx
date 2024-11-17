import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { z } from "zod";
import { insertTransactionSchema } from "@/db/schema";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-categories";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createmutation = useCreateTransaction(); // Move this inside the component

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name });
  };
  
  const accountOptions = (Array.isArray(accountQuery.data) ? accountQuery.data : []).map((account) => ({
    label: account.name,
    value: account.id,
  }));
  


  const categoryQuery=useGetCategories();
  const categoryMutation=useCreateCategory();

  const onCreateCategory=(name:string)=>categoryMutation.mutate({
    name
  })

  const categoryOptions= (categoryQuery.data??[]).map((category)=>({
    label:category.name,
    value:category.id,
  }))

    const isPending =createmutation.isPending||categoryMutation.isPending|| accountMutation.isPending

    const isLoading=categoryQuery.isLoading|| accountQuery.isLoading

  const onSubmit = (values: FormValues) => {
    createmutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add New Transaction</SheetDescription>
        </SheetHeader>

        {isLoading?(
          <div className="absolute inset-0 flex items-center justify-center"> 
          <Loader2 className="size-4 text-muted-foreground animate-spin"/>
          </div>
        ):(
          <TransactionForm 
          onSubmit={onSubmit}
           disabled={isPending} 
           categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory} 
            accountOptions={accountOptions} 
          onCreateAccount={onCreateAccount}/>
        )}
       
        
      </SheetContent>
    </Sheet>
  );
};
