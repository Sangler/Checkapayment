import { query } from '../db/postgres';

export const contributionSchema = {
  userId: { type: 'number' },
  firstName: { type: 'string', required: true },
  lastName: { type: 'string', required: true },
  userEmail: { type: 'string', required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  createdAt: { type: 'date', default: null },
};

export async function createSupportRequest(data: any) {
  const result = await query(
    `INSERT INTO support_requests (user_id, first_name, last_name, user_email, title, content, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    [data.userId || null, data.firstName, data.lastName, data.userEmail, data.title, data.content]
  );
  return result.rows[0];
}
