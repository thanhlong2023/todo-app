import type { FormEvent } from 'react';
import type { TodoSortType, TodoStatusFilter } from '../types/todo';

interface TodoFiltersProps {
    searchInput: string;
    status: TodoStatusFilter;
    sort: TodoSortType;
    onSearchInputChange: (value: string) => void;
    onSearchSubmit: () => void;
    onStatusChange: (value: TodoStatusFilter) => void;
    onSortChange: (value: TodoSortType) => void;
    onReset: () => void;
}

function TodoFilters({
    searchInput,
    status,
    sort,
    onSearchInputChange,
    onSearchSubmit,
    onStatusChange,
    onSortChange,
    onReset,
}: TodoFiltersProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearchSubmit();
    };
    return (
        <div className="filters">
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên công việc..."
                    value={searchInput}
                    onChange={(event) => onSearchInputChange(event.target.value)}
                />

                <button className="btn btn-primary" type="submit">
                    Tìm kiếm
                </button>
            </form>

            <div className="filter-row">
                <select
                    value={status}
                    onChange={(event) =>
                        onStatusChange(event.target.value as TodoStatusFilter)
                    }
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chưa hoàn thành</option>
                    <option value="completed">Đã hoàn thành</option>
                </select>

                <select
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value as TodoSortType)}
                >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                </select>
                <button className="btn btn-secondary" type="button" onClick={onReset}>
                    Đặt lại
                </button>
            </div>
        </div>
    );
}

export default TodoFilters;
