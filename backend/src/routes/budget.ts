import express from 'express';
import { createItem, deleteItem, updateItemByID } from '@/controllers/budget/item';
import { createGroup, editGroupLabel } from '@/controllers/budget/group';
import { createBudget } from '@/controllers/budget/budget';
const router = express.Router();

router.post('/item', createItem); // post item
router.put('item/:', updateItemByID); // edit item by id
router.delete('/item/:', deleteItem); //delete item by id

router.post('/group/:id', editGroupLabel); //edit group label
router.post('/group', createGroup); //add a group

router.post('/', createBudget);

export const budgetRouter = router;
