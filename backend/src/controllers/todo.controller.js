const { Op } = require('sequelize');
const { Todo } = require('../models');

const getTodos = async (req, res, next) => {
    try {
        const {
            search = '',
            status = 'all',
            page = 1,
            limit = 10,
            sort = 'newest'
        } = req.query;

        const currentPage = Math.max(Number(page || 1), 1);
        const pageSize = Math.max(Number(limit || 10), 1);
        const offset = (currentPage - 1) * pageSize;

        const where = {};

        if (search.trim()) {
            where.title = {
                [Op.like]: `%${search.trim()}%`
            };
        }

        if (status === 'completed') {
            where.is_completed = true;
        } else if (status === 'pending') {
            where.is_completed = false;
        } else if (status !== 'all') {
            return res.status(400).json({
                success: false,
                message: 'Status không hợp lệ. Chỉ nhận: all, completed, pending'
            });
        }

        let order = [['created_at', 'DESC']];

        if (sort === 'oldest') {
            order = [['created_at', 'ASC']];
        } else if (sort !== 'newest') {
            return res.status(400).json({
                success: false,
                message: 'Sort không hợp lệ. Chỉ nhận: newest, oldest'
            });
        }

        const { rows, count } = await Todo.findAndCountAll({
            where,
            order,
            limit: pageSize,
            offset
        });

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách công việc thành công',
            data: rows,
            pagination: {
                totalItems: count,
                currentPage,
                pageSize,
                totalPages: Math.ceil(count / pageSize)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lấy chi tiết công việc thành công',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề công việc không được để trống'
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : null
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm công việc thành công',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc'
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề công việc không được để trống'
      });
    }

    if (is_completed !== undefined && typeof is_completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái hoàn thành phải là true hoặc false'
      });
    }

    await todo.update({
      title: title !== undefined ? title.trim() : todo.title,
      description:
        description !== undefined
          ? description.trim() || null
          : todo.description,
      is_completed:
        is_completed !== undefined ? is_completed : todo.is_completed
    });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật công việc thành công',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

const toggleTodoStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc'
      });
    }

    await todo.update({
      is_completed: !todo.is_completed
    });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái công việc thành công',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByPk(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc'
      });
    }

    await todo.destroy();

    return res.status(200).json({
      success: true,
      message: 'Xóa công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo
};