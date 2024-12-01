import express from 'express';
import { createItem, deleteItem, reorder, updateItemByID } from '@/controllers/budget/item';
import { createGroup, deleteGroup, editGroupLabel, reorderGroups } from '@/controllers/budget/group';
import {
  cloneBudget,
  createOnboardingBudget,
  getAllExistenceBudget,
  getBudgetByMonth,
} from '@/controllers/budget/budget';
import {
  copyTransaction,
  createTransaction,
  deleteTransaction,
  getAllTransaction,
  getTransactionById,
  updateTransactionByID,
} from '@/controllers/budget/transaction';
import { checkScanStatus, scanTransaction } from '@/controllers/scanTransaction';
import { upload } from '@/middleware/multer';
import { getScanStatus } from '@/utils/scanSessionService';
const router = express.Router();

router.post('/item/reorder', reorder);
router.post('/item', createItem); // post item
router.put('/item/:id', updateItemByID); // edit item by id
router.delete('/item/:id', deleteItem); //delete item by id

router.post('/transaction', createTransaction); // post item
router.put('/transaction/:id', updateTransactionByID); // update item
router.get('/transaction/', getAllTransaction); // update item
router.get('/transaction/:id', getTransactionById); // update item
router.delete('/transaction/:id', deleteTransaction);
router.post('/transaction/copy/:id', copyTransaction);

router.post('/transaction/scan', upload.single('image'), scanTransaction); //scan Transaction
router.post('/transaction/scan/:id', checkScanStatus);

router.put('/group/:id', editGroupLabel); //edit group label
router.post('/group', createGroup);
router.delete('/group/:id', deleteGroup); //add a group
router.post('/group/reorder', reorderGroups);

router.post('/onboarding-complete', createOnboardingBudget);

router.post('/by-date', getBudgetByMonth);
router.get('/budgets', getAllExistenceBudget);
router.post('/:id', cloneBudget);

export const budgetRouter = router;
