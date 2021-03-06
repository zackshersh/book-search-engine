const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }
    
    type User {
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        getSingleUser(_id: String, username: String): User
        getAllUsers: [User]
        getMe: User
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String]!, description: String!, title: String!, bookId: String!, image: String, link: String): User
        removeBook(bookId: String!): User
        login(email: String!, password: String!): Auth
    }


`;

module.exports = typeDefs;