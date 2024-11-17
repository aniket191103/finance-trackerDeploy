"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

import { columns } from "./column";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";


import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useState } from "react";
import { UploadButton } from "./upload-button";



enum VARIANT {
  LIST="LIST",
  IMPORT ="IMPORT"
};

const INITIAL_IMPORT_RESULTS={
  date :[],
  errors: [],
  meta : {}
}

const TransactionPage = () => {

  const [variant ,setVariant]= useState<VARIANT>(VARIANT.LIST);
const  onUpload = (results :typeof INITIAL_IMPORT_RESULTS)=>{
  setVariant (VARIANT.IMPORT)
}
  const newTransaction = useNewTransaction();
  const transactionQuery = useGetTransactions();
  const deleteTransaction = useBulkDeleteTransactions();

  const isDisabled = transactionQuery.isLoading || deleteTransaction.isPending;

  // Ensure accounts is always of type { id: string; name: string; }[]
  const transaction = transactionQuery.data || [];

  if (transactionQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  if(variant=== VARIANT.IMPORT){
    return(
      <>
      <div>
        THIS IS SCREEN FOR IMPORt
        </div>
        </>
    )
  }
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-x-2">

          <Button size="sm" onClick={newTransaction.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>


          <UploadButton
          onUpload ={
            onUpload
          }
          />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns}
            data={transaction}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransaction.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPage;
