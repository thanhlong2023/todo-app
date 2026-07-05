import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { TodoFormValues } from '../types/todo';

interface TodoFormProps {
    initialValues?: TodoFormValues;
    submitLabel?: string;
    loading?: boolean;
    onSubmit: (values: TodoFormValues) => Promise<void> | void;
    onCancel?: () => void;
}

function TodoForm({
    initialValues,
    submitLabel = 'Thêm công việc',
    loading = false,
    onSubmit,
    onCancel,
}: TodoFormProps) {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(
        initialValues?.description || ''
    );
    const [error, setError] = useState('');

    useEffect(() => {
        setTitle(initialValues?.title || '');
        setDescription(initialValues?.description || '');
    }, [initialValues]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim()) {
            setError('Tiêu đề công việc không được để trống');
            return;
        }

        setError('');

        await onSubmit({
            title: title.trim(),
            description: description.trim(),
        });

        if (!initialValues) {
            setTitle('');
            setDescription('');
        }
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Tên công việc</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Ví dụ: Học Docker"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Mô tả</label>
                <textarea
                    id="description"
                    placeholder="Nhập mô tả công việc nếu có"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={loading}
                    rows={3}
                />
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : submitLabel}
                </button>

                {onCancel && (
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                )}
            </div>
        </form>
    );
}

export default TodoForm;
