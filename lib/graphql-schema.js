const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language

module.exports = buildSchema(`
  type Schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Query {
      base: String
      getUsers: [User]
      createUsers: [User]
      updateUsers: [User]
      deleteUsers: [User]
  }

  type Mutation {
    createUser(id: ID!, firstname: String!, lastname: String, email: String!, age: Int): User
    updatePost(id: ID! firstname: String!, lastname: String, email: String!, age: Int): User
    deletePost(id: ID!): User!
  }

  type Subscription {
      createdUser: User
      updatedUser: User
      deletedUser(id: ID!): User
  }

  type User {
      id: ID!
      firstname: String!
      lastname: String
      email: String!
      age: Int
  }
`);