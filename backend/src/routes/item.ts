import express from 'express';
import { createItem, deleteItem, updateItemByID } from '@/controllers/budget/item';
const router = express.Router();

router.post('/', createItem); // post item
router.put('/:id', updateItemByID); // edit item by id
router.delete('/:id', deleteItem); //delete item by id
export const itemRouter = router;
