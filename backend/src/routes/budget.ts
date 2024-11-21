import express from 'express';
import { createItem, deleteItem, updateItemByID } from '@/controllers/budget/item';
import { createGroup, deleteGroup, editGroupLabel } from '@/controllers/budget/group';
import { createBudget, getBudgetByMonth } from '@/controllers/budget/budget';
const router = express.Router();

router.post('/item', createItem); // post item
router.put('item/:id', updateItemByID); // edit item by id
router.delete('/item/:id', deleteItem); //delete item by id

router.put('/group/:id', editGroupLabel); //edit group label
router.post('/group', createGroup);
router.delete('/group/:id', deleteGroup); //add a group

router.post('/onboarding-complete', createBudget);

router.post('/by-date', getBudgetByMonth);

export const budgetRouter = router;
