import { useCallback, useEffect, useState } from 'react';
import { todoApi } from './api/todoApi';
import Pagination from './components/Pagination';
import TodoFilters from './components/TodoFilters';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import type {
  PaginationMeta,
  Todo,
  TodoFormValues,
  TodoListParams,
  TodoSortType,
  TodoStatusFilter,
} from './types/todo';

const DEFAULT_PAGINATION: PaginationMeta = {
  totalItems: 0,
  currentPage: 1,
  pageSize: 5,
  totalPages: 0,
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TodoStatusFilter>('all');
  const [sort, setSort] = useState<TodoSortType>('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadTodos = useCallback(
    async (overrideParams: Partial<TodoListParams> = {}) => {
      try {
        setLoading(true);
        setError('');

        const params: TodoListParams = {
          search,
          status,
          page,
          limit,
          sort,
          ...overrideParams,
        };

        const response = await todoApi.getTodos(params);

        setTodos(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Không thể tải danh sách công việc'
        );
      } finally {
        setLoading(false);
      }
    },
    [search, status, page, limit, sort]
  );

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [searchInput]);

  const handleCreateTodo = async (values: TodoFormValues) => {
    try {
      setActionLoading('create');
      setError('');

      await todoApi.createTodo(values);

      setSearchInput('');
      setSearch('');
      setStatus('all');
      setSort('newest');
      setPage(1);

      await loadTodos({
        search: '',
        status: 'all',
        sort: 'newest',
        page: 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể thêm công việc');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateTodo = async (id: number, values: TodoFormValues) => {
    try {
      setActionLoading(`update-${id}`);
      setError('');

      await todoApi.updateTodo(id, values);
      await loadTodos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể cập nhật công việc'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      setActionLoading(`toggle-${id}`);
      setError('');

      await todoApi.toggleTodo(id);
      await loadTodos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể đổi trạng thái công việc'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const isConfirmed = window.confirm('Bạn có chắc muốn xóa công việc này?');

    if (!isConfirmed) {
      return;
    }

    try {
      setActionLoading(`delete-${id}`);
      setError('');

      await todoApi.deleteTodo(id);

      if (todos.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadTodos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa công việc');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearchSubmit = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleStatusChange = (value: TodoStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (value: TodoSortType) => {
    setSort(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('all');
    setSort('newest');
    setPage(1);
    setLimit(5);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">Intern Developer Test</p>
          <h1>Todo List App</h1>
          <p className="hero-desc">
            Ứng dụng quản lý công việc dùng React TypeScript, Express, Sequelize
            và MySQL.
          </p>
        </div>

        <div className="stats-card">
          <span>Tổng công việc</span>
          <strong>{pagination.totalItems}</strong>
        </div>
      </section>

      <section className="layout">
        <aside className="panel">
          <h2>Thêm công việc</h2>

          <TodoForm
            submitLabel="Thêm công việc"
            loading={actionLoading === 'create'}
            onSubmit={handleCreateTodo}
          />
        </aside>

        <section className="panel todo-section">
          <div className="section-heading">
            <div>
              <h2>Danh sách công việc</h2>
              <p>Quản lý, tìm kiếm và lọc trạng thái công việc.</p>
            </div>
          </div>

          <TodoFilters
            searchInput={searchInput}
            status={status}
            sort={sort}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
            onReset={handleResetFilters}
          />

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="empty-state">Đang tải dữ liệu...</div>
          ) : todos.length > 0 ? (
            <div className="todo-list">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  loading={actionLoading !== null}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onUpdate={handleUpdateTodo}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Không có công việc nào</h3>
              <p>Hãy thêm công việc mới hoặc thay đổi bộ lọc.</p>
            </div>
          )}

          <Pagination
            pagination={pagination}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        </section>
      </section>
    </main>
  );
}

export default App;
