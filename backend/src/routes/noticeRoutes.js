import express from 'express';
import Notice from '../models/Notice.js';
import { allowRoles, canDeleteNotice, canEditNotice, getUserRole } from '../middleware/roleAccess.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    next(error);
  }
});

router.post('/', allowRoles('principal'), async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const notice = await Notice.create({
      title,
      content,
      createdBy: req.userRole
    });

    res.status(201).json(notice);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const userRole = getUserRole(req);

    if (!canEditNotice(userRole)) {
      return res.status(403).json({ message: 'Only teachers and principals can edit notices.' });
    }

    const { title, content } = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    res.json(updatedNotice);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const userRole = getUserRole(req);

    if (!canDeleteNotice(userRole)) {
      return res.status(403).json({ message: 'Only principals and admins can delete notices.' });
    }

    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

    if (!deletedNotice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;