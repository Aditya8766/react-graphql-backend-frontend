const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const tasks = [];

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }
  type Query {
    tasks: [Task]
  }
  type Mutation {
    createTask(title: String!): Task
    updateTask(id: ID!, title: String, completed: Boolean): Task
    deleteTask(id: ID!): Boolean
  }
`;
const resolvers = {
  Query: {
    tasks: () => tasks,
  },
  Mutation: {
    createTask: (_, { title }) => {
      const id = tasks.length.toString();
      const newTask = { id, title, completed: false };
      tasks.push(newTask);
      return newTask;
    },
    updateTask: (_, { id, title, completed }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        if (title !== undefined) tasks[taskIndex].title = title;
        if (completed !== undefined) tasks[taskIndex].completed = completed;
        return tasks[taskIndex];
      }
      return null;
    },
    deleteTask: (_, { id }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        return true;
      }
      return false;
    },
  },
};
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
startServer();

