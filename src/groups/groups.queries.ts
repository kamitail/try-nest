export const insertGroup = `
mutation($group: groups_insert_input!) {
    insert_groups_one(object: $group) {
      id
      name
    }
  }
`;

export const insertGroupMembers = `
mutation($groupMembers: [group_members_insert_input!]!) {
    insert_group_members(objects: $groupMembers) {
      returning {
        id
        isOwner
        user {
            birthdate
            email
            firstname
            id
            lastname
            phoneNum
        }
      }
    }
  }  
`;

export const findGroupsByMemberId = `
query($userId: Int!) {
    groups(where: {groupMembers: {userId: {_eq: $userId}}}) {
      groupMembers {
        id
        isOwner
        user {
          birthdate
          email
          firstname
          id
          lastname
          phoneNum
        }
      }
      id
      name
    }
  }
`;

export const deleteGroupMembers = `
mutation ($membersIds: [Int!]!, $groupId: Int!) {
    delete_group_members(where: {userId: {_in: $membersIds}, groupId: {_eq: $groupId}}) {
      affected_rows
    }
  }
`;
