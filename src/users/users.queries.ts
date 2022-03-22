export const insertUser = `
mutation($user: users_insert_input!) {
    insert_users_one(object: $user) {
      id
    }
  }
`;

export const findUserByEmailAndPassword = `
query($email: String!) {
    users(where: {email: {_eq: $email}}) {
      id
      password
    }
  }
`;

export const findAllUsers = `
query {
  users {
    birthdate
    email
    firstname
    lastname
    id
    phoneNum
  }
}
`;
