export type UserInfo = {
    id: number;
    username: string;
};

export type Todo = {
    id: number;
    title: string;
    is_done: boolean;
    added_by: string;
    created_at: string;
};

export type TodoItemUI = Pick <Todo, 'id' | 'title' | 'is_done'>;

export type TodoEditData = Partial<TodoItemUI>;
