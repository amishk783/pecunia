import { groups,budget } from './schema/Budget';
import { db } from './index';

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI not found');
}
import { groupTypeEnum } from './schema/Budget';
import { group } from 'console';

const budget_seed:{date:Date}[] = [{ date: new Date('2022-07-24') }];
const seed_group: { type: 'expense' | 'income'; label: string }[] = [
  {
    type: groupTypeEnum.enumValues[0],
    label: 'Food',
  },
  {
    type: groupTypeEnum.enumValues[0],
    label: 'Lifestyle',
  },
  {
    type: groupTypeEnum.enumValues[0],
    label: 'Paycheck 1',
  },
];

const main = async () => {
  await db.insert(budget).values(budget_seed.map(item => ({ date: item.date.toISOString() })));

  const data: (typeof groups.$inferInsert)[] = seed_group.map(group => ({
    type: group.type,
    label: group.label,
  }));
  console.log('Seed start');
  await db.insert(groups).values(data);
  console.log('Data prepared:', data);
};
main();
