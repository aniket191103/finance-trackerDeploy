"use client"

import { Button } from "@/components/ui/button";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/hooks/use-open-account";
import { useConfirm } from "@/hooks/use-confirm";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"
import { Edit, MoreHorizontal, Trash } from "lucide-react";

  type Props ={
    id:string;
}
export const Actions=({id}:Props)=>{
const [ConfirmDialog,confirm] =useConfirm("Are you sure ?","You are about to delete this account ")

const {onOpen} =useOpenAccount();
const deleteMutation = useDeleteAccount(id);
const handleDelete =async()=>{
    const ok = await confirm();
    if(ok){
deleteMutation.mutate(undefined,{

});
    }
 }
    return (
       <>
       <ConfirmDialog/>
       <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant="ghost" className="size-8 p-0 ">
                <MoreHorizontal className="size-4"/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuItem 
        disabled={deleteMutation.isPending}
        onClick={()=>{
            onOpen(id)
        }}>
            <Edit className="size-4 mr-2"/>
            Edit
        </DropdownMenuItem>
        <DropdownMenuItem
        disabled={deleteMutation.isPending}
        onClick={handleDelete}>
            <Trash className="size-4 mr-2"/>
            Delete
        </DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
       </>
    )
}