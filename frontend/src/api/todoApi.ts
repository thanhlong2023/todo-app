import type {
    ApiResponse,
    Todo,
    TodoFormValues,
    TodoListParams,
    TodoListResponse,
} from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || 'Có lỗi xảy ra khi gọi API');
    }

    return data as T;
}

export const todoApi = {
    getTodos: async (params: TodoListParams = {}) => {
        const searchParams = new URLSearchParams();

        if (params.search) {
            searchParams.set('search', params.search);
        }

        if (params.status) {
            searchParams.set('status', params.status);
        }

        if (params.page) {
            searchParams.set('page', String(params.page));
        }

        if (params.limit) {
            searchParams.set('limit', String(params.limit));
        }

        if (params.sort) {
            searchParams.set('sort', params.sort);
        }

        const queryString = searchParams.toString();

        return request<TodoListResponse>(
            `/todos${queryString ? `?${queryString}` : ''}`
        );
    },

    createTodo: async (payload: TodoFormValues) => {
        return request<ApiResponse<Todo>>('/todos', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    updateTodo: async (id: number, payload: Partial<TodoFormValues & { is_completed: boolean }>) => {
        return request<ApiResponse<Todo>>(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    },

    toggleTodo: async (id: number) => {
        return request<ApiResponse<Todo>>(`/todos/${id}/toggle`, {
            method: 'PATCH',
        });
    },

    deleteTodo: async (id: number) => {
        return request<ApiResponse<null>>(`/todos/${id}`, {
            method: 'DELETE',
        });
    },
};