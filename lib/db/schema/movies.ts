import { nanoid } from "@/lib/utils";
import {
  index,
  pgTable,
  text,
  varchar,
  vector,
  numeric,
} from "drizzle-orm/pg-core";
import { resources } from "./resources";

export const embeddings = pgTable(
  "movies",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar("resource_id", { length: 191 }).references(
      () => resources.id,
      { onDelete: "cascade" }
    ),
    title: text("title").notNull(),
    year: numeric("year").notNull(),
    directors: text("directors").array().notNull(),
    actors: text("actors").array().notNull(),
    genres: text("genres").array().notNull(),
    audience_rating: numeric("audience_rating").notNull(),
    critics_rating: numeric("critics_rating").notNull(),
    description: text("content").notNull(),
    description_embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.description_embedding.op("vector_cosine_ops")
    ),
  })
);
