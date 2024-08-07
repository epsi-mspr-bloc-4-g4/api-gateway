import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express from "express";
import * as dotevnv from "dotenv";
import helmet from "helmet";
import routes from "./routes";

dotevnv.config();

export const checkPort = () => {
  if (!process.env.PORT) {
    throw new Error("No port value specified...");
  }
};

checkPort();

const PORT = parseInt(process.env.PORT as string, 10);

Sentry.init({
  dsn: "https://6e275a4fb52b9ca6e44220b4c39dc16b@o4507378463080448.ingest.de.sentry.io/4507529028042832",
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

Sentry.setupExpressErrorHandler(app);

app.use("/", routes);

app.use((req, res) => {
  res.status(404).send({ message: "Bad request" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;
