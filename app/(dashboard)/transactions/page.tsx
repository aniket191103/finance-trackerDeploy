"use client";

import React, { Suspense, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";

import { columns } from "./column";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";

import { transaction as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from "@/hooks/use-select-account";
import { toast } from "sonner";

enum VARIANT {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANT>(VARIANT.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANT.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANT.LIST);
  };

  const newTransaction = useNewTransaction();
  const bulkCreateMutation = useBulkCreateTransactions();

  const transactionQuery = useGetTransactions();
  const deleteTransaction = useBulkDeleteTransactions();

  const isDisabled = transactionQuery.isLoading || deleteTransaction.isPending;

  const transaction = transactionQuery.data || [];

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));
    bulkCreateMutation.mutate(
      { json: data },
      {
        onSuccess: () => {
          onCancelImport();
        },
      }
    );
  };

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

  if (variant === VARIANT.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center">
          <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
        </div>
      }
    >
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Transaction History
            </CardTitle>
            <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
              <Button
                size="sm"
                onClick={newTransaction.onOpen}
                className="w-full lg:w-auto"
              >
                <Plus className="size-4 mr-2" />
                Add new
              </Button>

              <UploadButton onUpload={onUpload} />
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
    </Suspense>
  );
};

export default TransactionPage;
