import * as z from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const reorderItemSchema = z.object({
  id: z.number().min(1, 'Item ID is required'),

  groupId: z.number().min(1, 'Group ID is required'),
  position: z.number().min(0, 'Position must be a non-negative number'),
});
export const reorderItemsSchemaArray = z.array(reorderItemSchema);

export const updateTaskSchema = z.object({
  _id: z.string().min(1, 'Task Id is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().optional(),
  boardId: z.string().min(1, 'Board Id is required').optional(),
  listId: z.string().min(1, 'List Id is required'),
  deadline: z.coerce.string().transform(Date).optional(),
  priority: z.string().optional(),
});

export const boardScehma = z.object({
  name: z.string().min(1, 'Board name is required'),
  workspaceId: z.string().min(1, 'Workspace Id is required'),
});

export const listValidationSchema = z.object({
  name: z.string().min(1, 'List name is required'),
  position: z.number().optional(),
  boardId: z.string().min(1, 'Board Id is required'),
});
export const updatedListValidationSchema = z.object({
  name: z.string().min(1, 'List name is required'),
  position: z.number().optional(),
  boardId: z.string().min(1, 'Board Id is required'),
  listId: z.string().min(1, 'List Id is required'),
});

export const profileValidationSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  company: z.string().optional(),
  jobtitle: z.string().optional(),
  location: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
    })
    .optional(),
});

export const workspaceValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
