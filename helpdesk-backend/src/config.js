const config = {
  db: {
    mongo: {
      uri: process.env.MONGO_URI || "mongodb://localhost/test",
    },
  },
  sessionSecret: process.env.SESSION_SECRET || "BAD_SECRET",
  jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
  twitter: {
    consumerKey: "JAABlOt9wzw9dyr8SASkPjRrj",
    consumerSecret: "ki0m1aFKtdYisdalDQUOHnfOS0EI5XC1Iez1xbhx0Htox2NwrI",
  },
};

export default config;
