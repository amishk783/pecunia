// import { groups,budget} from './schema/Budget';
// import { db } from './index';

// if (!process.env.DATABASE_URI) {
//   throw new Error('DATABASE_URI not found');
// }
// import { groupTypeEnum } from './schema/Budget';


// const budget_seed:{date:Date}[] = [{ date: new Date('2022-06-12') }];
// const seed_group: { type: 'expense' | 'income'; label: string }[] = [
//   {
//     type: groupTypeEnum.enumValues[0],
//     label: 'Food',
//   },
//   {
//     type: groupTypeEnum.enumValues[0],
//     label: 'Lifestyle',
//   },
//   {
//     type: groupTypeEnum.enumValues[1],
//     label: 'Paycheck 1',
//   },
// ];

// export const seed = async () => {

//   const {id:budgetId} =await db.query.budget.findFirst({with: true});

//   const data: (typeof groups.$inferInsert)[] = seed_group.map(group => ({
//     type: group.type,
//     label: group.label,
//     budgetID:budgetId
//   }));
//   console.log('Seed start');
//   await db.insert(groups).values(data);
//   console.log('Data prepared:', data);
// };
// seed();
