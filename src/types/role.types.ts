import type {ListBasic} from "@/types/list.types";
import type {PermissionSummary} from "@/types/permission.types";

export interface RoleSummary {
    id: bigint;
    list?: ListBasic;
    name: string;
    permissions: PermissionSummary[];
}

export interface RoleCreate {
    name: string;
    color?: string;
    level: number;
    listId?: bigint;
    permissions?: bigint[]
}

export interface RoleUpdate {
    id: bigint;
    name?: string;
    color?: string;
    level?: number;
    permissions?: bigint[]
}