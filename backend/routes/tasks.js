const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const [tasks] = await pool.execute(`
      SELECT t.*, u.username as assigned_to_username, c.username as created_by_username
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.created_by = ? OR t.assigned_to = ?
      ORDER BY t.created_at DESC
    `, [req.user.id, req.user.id]);

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const [tasks] = await pool.execute(`
      SELECT t.*, u.username as assigned_to_username, c.username as created_by_username
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.id = ? AND (t.created_by = ? OR t.assigned_to = ?)
    `, [req.params.id, req.user.id, req.user.id]);

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: tasks[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/', auth, [
  body('title').notEmpty().trim().escape(),
  body('description').optional().trim().escape(),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601().toDate(),
  body('assigned_to').optional().isInt()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, due_date, assigned_to } = req.body;

    // Check if assigned user exists (if provided)
    if (assigned_to) {
      const [users] = await pool.execute(
        'SELECT id FROM users WHERE id = ?',
        [assigned_to]
      );
      if (users.length === 0) {
        return res.status(400).json({ error: 'Assigned user not found' });
      }
    }

    const [result] = await pool.execute(`
      INSERT INTO tasks (title, description, priority, due_date, assigned_to, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, priority, due_date, assigned_to, req.user.id]);

    // Get the created task
    const [tasks] = await pool.execute(`
      SELECT t.*, u.username as assigned_to_username, c.username as created_by_username
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.id = ?
    `, [result.insertId]);

    res.status(201).json({
      message: 'Task created successfully',
      task: tasks[0]
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, [
  body('title').optional().notEmpty().trim().escape(),
  body('description').optional().trim().escape(),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('due_date').optional().isISO8601().toDate(),
  body('assigned_to').optional().isInt()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const taskId = req.params.id;
    const { title, description, status, priority, due_date, assigned_to } = req.body;

    // Check if task exists and user has permission
    const [existingTasks] = await pool.execute(`
      SELECT * FROM tasks WHERE id = ? AND (created_by = ? OR assigned_to = ?)
    `, [taskId, req.user.id, req.user.id]);

    if (existingTasks.length === 0) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    // Check if assigned user exists (if provided)
    if (assigned_to) {
      const [users] = await pool.execute(
        'SELECT id FROM users WHERE id = ?',
        [assigned_to]
      );
      if (users.length === 0) {
        return res.status(400).json({ error: 'Assigned user not found' });
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (due_date !== undefined) {
      updateFields.push('due_date = ?');
      updateValues.push(due_date);
    }
    if (assigned_to !== undefined) {
      updateFields.push('assigned_to = ?');
      updateValues.push(assigned_to);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateValues.push(taskId);
    const updateQuery = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`;

    await pool.execute(updateQuery, updateValues);

    // Get the updated task
    const [tasks] = await pool.execute(`
      SELECT t.*, u.username as assigned_to_username, c.username as created_by_username
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users c ON t.created_by = c.id
      WHERE t.id = ?
    `, [taskId]);

    res.json({
      message: 'Task updated successfully',
      task: tasks[0]
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const taskId = req.params.id;

    // Check if task exists and user has permission (only creator can delete)
    const [existingTasks] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ? AND created_by = ?',
      [taskId, req.user.id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({ error: 'Task not found or access denied' });
    }

    await pool.execute('DELETE FROM tasks WHERE id = ?', [taskId]);

    res.json({ message: 'Task deleted successfully' });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 