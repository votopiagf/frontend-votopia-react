/**
 * User Use Cases - Application/Business Logic Layer
 * Pattern: Use Case + Command/Query Separation
 */

import type { IUserRepository, CreateUserRequest, UpdateUserRequest } from '@/data/repositories/UserRepository';
import type { User, Role, List } from '@/domain/mappers/UserMapper';

/**
 * Abstrazione dei risultati
 */
export class Result<T> {
    private constructor(
        readonly isSuccess: boolean,
        readonly value?: T,
        readonly error?: Error
    ) {}

    static ok<T>(value: T): Result<T> {
        return new Result(true, value);
    }

    static fail<T>(error: Error): Result<T> {
        return new Result(false, undefined, error);
    }

    getOrThrow(): T {
        if (!this.isSuccess) throw this.error;
        return this.value!;
    }
}

/**
 * QUERY Use Cases
 */
export class GetUsersQuery {
    constructor(private repository: IUserRepository) {}

    async execute(targetListId?: number): Promise<Result<User[]>> {
        try {
            const users = await this.repository.getAll(targetListId);
            return Result.ok(users);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class GetUserByIdQuery {
    constructor(private repository: IUserRepository) {}

    async execute(id: number): Promise<Result<User | null>> {
        try {
            const user = await this.repository.getById(id);
            return Result.ok(user);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class GetAvailableListsQuery {
    constructor(private repository: IUserRepository) {}

    async execute(): Promise<Result<List[]>> {
        try {
            const lists = await this.repository.getAssignableLists();
            return Result.ok(lists);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class GetAvailableRolesQuery {
    constructor(private repository: IUserRepository) {}

    async execute(targetListId?: number): Promise<Result<Role[]>> {
        try {
            const roles = await this.repository.getAssignableRoles(targetListId);
            return Result.ok(roles);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class GetScreenInitializationQuery {
    constructor(private repository: IUserRepository) {}

    async execute() {
        try {
            const data = await this.repository.getInitializationData();
            return Result.ok(data);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

/**
 * COMMAND Use Cases
 */
export class CreateUserCommand {
    constructor(private repository: IUserRepository) {}

    async execute(request: CreateUserRequest): Promise<Result<User>> {
        try {
            // Validazione
            if (!request.name?.trim()) {
                throw new Error('Nome è obbligatorio');
            }
            if (!request.email?.trim()) {
                throw new Error('Email è obbligatoria');
            }

            const user = await this.repository.create(request);
            return Result.ok(user);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class CreateMultipleUsersCommand {
    constructor(private repository: IUserRepository) {}

    async execute(requests: CreateUserRequest[]): Promise<Result<User[]>> {
        try {
            // Validazione
            if (!requests.length) {
                throw new Error('Almeno un utente è richiesto');
            }

            requests.forEach(req => {
                if (!req.name?.trim()) throw new Error('Nome è obbligatorio per ogni utente');
                if (!req.email?.trim()) throw new Error('Email è obbligatoria per ogni utente');
            });

            const users = await this.repository.createMany(requests);
            return Result.ok(users);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class UpdateUserCommand {
    constructor(private repository: IUserRepository) {}

    async execute(request: UpdateUserRequest): Promise<Result<User>> {
        try {
            const user = await this.repository.update(request);
            return Result.ok(user);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class UpdateMultipleUsersCommand {
    constructor(private repository: IUserRepository) {}

    async execute(requests: UpdateUserRequest[]): Promise<Result<User[]>> {
        try {
            if (!requests.length) {
                throw new Error('Almeno un utente è richiesto');
            }

            const users = await this.repository.updateMany(requests);
            return Result.ok(users);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class DeleteUserCommand {
    constructor(private repository: IUserRepository) {}

    async execute(id: number): Promise<Result<void>> {
        try {
            await this.repository.delete(id);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class DeleteMultipleUsersCommand {
    constructor(private repository: IUserRepository) {}

    async execute(ids: number[]): Promise<Result<void>> {
        try {
            if (!ids.length) {
                throw new Error('Almeno un ID è richiesto');
            }

            await this.repository.deleteMany(ids);
            return Result.ok(undefined);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

export class ExportUsersCommand {
    constructor(private repository: IUserRepository) {}

    async execute(targetListId?: number): Promise<Result<Blob>> {
        try {
            const blob = await this.repository.exportAsExcel(targetListId);
            return Result.ok(blob);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}

/**
 * Use Case Facade - Aggregazione di tutte le use cases
 */
export class UserUseCases {
    // Query
    readonly getUsers: GetUsersQuery;
    readonly getUserById: GetUserByIdQuery;
    readonly getAvailableLists: GetAvailableListsQuery;
    readonly getAvailableRoles: GetAvailableRolesQuery;
    readonly getScreenInitialization: GetScreenInitializationQuery;

    // Commands
    readonly createUser: CreateUserCommand;
    readonly createMultipleUsers: CreateMultipleUsersCommand;
    readonly updateUser: UpdateUserCommand;
    readonly updateMultipleUsers: UpdateMultipleUsersCommand;
    readonly deleteUser: DeleteUserCommand;
    readonly deleteMultipleUsers: DeleteMultipleUsersCommand;
    readonly exportUsers: ExportUsersCommand;

    constructor(repository: IUserRepository) {
        // Query
        this.getUsers = new GetUsersQuery(repository);
        this.getUserById = new GetUserByIdQuery(repository);
        this.getAvailableLists = new GetAvailableListsQuery(repository);
        this.getAvailableRoles = new GetAvailableRolesQuery(repository);
        this.getScreenInitialization = new GetScreenInitializationQuery(repository);

        // Commands
        this.createUser = new CreateUserCommand(repository);
        this.createMultipleUsers = new CreateMultipleUsersCommand(repository);
        this.updateUser = new UpdateUserCommand(repository);
        this.updateMultipleUsers = new UpdateMultipleUsersCommand(repository);
        this.deleteUser = new DeleteUserCommand(repository);
        this.deleteMultipleUsers = new DeleteMultipleUsersCommand(repository);
        this.exportUsers = new ExportUsersCommand(repository);
    }
}

