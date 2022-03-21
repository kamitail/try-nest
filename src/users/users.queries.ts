export const insertUser = `
mutation($user: users_insert_input!) {
    insert_users_one(object: $user) {
      id
    }
  }
`;
