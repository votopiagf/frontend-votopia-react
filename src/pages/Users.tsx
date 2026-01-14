import {FormEvent, useState} from "react";
import {Statistics, UserDisplay} from "@/types/user.types.ts";
import {RoleBasicInfoDisplay} from "@/types/roles.types.ts";
import api from "@/services/api.ts";
import type {ApiError as FrontendApiError} from "@/types/common.types.ts";

export default function UsersScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [users, setUsers] = useState<UserDisplay[] | null>(null);
    const [roles, setRoles] = useState<RoleBasicInfoDisplay[] | null>(null)
    const [stat, setStat] = useState<Statistics | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [surname, setSurname] = useState("");
    const [listsSelected, setListsSelected] = useState<number | null>(null);
    const [rolesSelected, setRolesSelected] = useState<number | null>(null);

    const handleInitScreen = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get("/api/users/init-screen/");
            setStat(response.data);
        } catch (err: unknown) {
            const apiErr = err as FrontendApiError;
            setError(apiErr.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleGetUsers = async () => {
        setIsLoading(true);

        try {
            const response = await api.get<UserDisplay[]>("/api/users/all/");
            setUsers(response.data);
        } catch (err: unknown) {
            const apiErr = err as FrontendApiError;
            setError(error + "\n" + apiErr.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRegisterUsers = async () => {
        setIsLoading(true);
        setError(null);


    }
}