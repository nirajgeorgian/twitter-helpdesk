import mongoose, { mongo } from "mongoose";
import User from "./user";
import Conversation from "./conversation";
import ConversationBlock from "./conversationBlock";
import config from "../config";

const connectDb = () => {
  /**
   * Create the database connection
   */
  mongoose.connect(config.db.mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  /**
   * CONNECTION EVENTS
   */

  /**
   * When successfully connected
   */
  mongoose.connection.on("connected", function () {
    console.log("Mongoose default connection is open to ", config.db.mongo.uri);
  });

  /**
   * If the connection throws an error
   */
  mongoose.connection.on("error", function (err) {
    console.log(
      error("Mongoose default connection has occured " + err + " error")
    );
  });

  /**
   * When the connection is disconnected
   */
  mongoose.connection.on("disconnected", function () {
    console.log(disconnected("Mongoose default connection is disconnected"));
  });

  /**
   * If the Node process ends, close the Mongoose connection
   */
  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });
};

export { User, Conversation, ConversationBlock };
export default connectDb;
