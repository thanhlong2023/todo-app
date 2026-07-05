import { useState } from 'react';
import type { Todo, TodoFormValues } from '../types/todo';
import TodoForm from './TodoForm';

interface TodoItemProps {
  todo: Todo;
  loading?: boolean;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, values: TodoFormValues) => Promise<void>;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

function TodoItem({
  todo,
  loading = false,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (values: TodoFormValues) => {
    await onUpdate(todo.id, values);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="todo-card">
        <TodoForm
          initialValues={{
            title: todo.title,
            description: todo.description || '',
          }}
          submitLabel="Lưu thay đổi"
          loading={loading}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`todo-card ${todo.is_completed ? 'completed' : ''}`}>
      <div className="todo-main">
        <button
          className={`check-button ${todo.is_completed ? 'checked' : ''}`}
          type="button"
          onClick={() => onToggle(todo.id)}
          disabled={loading}
          title="Đổi trạng thái"
        >
          {todo.is_completed ? '✓' : ''}
        </button>

        <div className="todo-content">
          <div className="todo-header">
            <h3>{todo.title}</h3>

            <span
              className={`status-badge ${
                todo.is_completed ? 'done' : 'pending'
              }`}
            >
              {todo.is_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            </span>
          </div>

          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}

          <p className="todo-date">Tạo lúc: {formatDate(todo.created_at)}</p>
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={loading}
        >
          Sửa
        </button>

        <button
          className="btn btn-danger"
          type="button"
          onClick={() => onDelete(todo.id)}
          disabled={loading}
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

export default TodoItem;