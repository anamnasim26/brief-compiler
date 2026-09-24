import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Recipe } from "@/lib/schema/recipe";

const DB_NAME = "brief-compiler";
const DB_VERSION = 1;
const STORE = "recipes";

interface BriefCompilerDB extends DBSchema {
  recipes: {
    key: string;
    value: Recipe;
    indexes: { "by-updated": string };
  };
}

let dbPromise: Promise<IDBPDatabase<BriefCompilerDB>> | null = null;

function getDb(): Promise<IDBPDatabase<BriefCompilerDB>> {
  if (typeof indexedDB === "undefined") {
    throw new Error("recipe-store can only run in the browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<BriefCompilerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE, { keyPath: "recipe_id" });
        store.createIndex("by-updated", "updated_at");
      },
    });
  }
  return dbPromise;
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  const db = await getDb();
  await db.put(STORE, recipe);
}

export async function getRecipe(id: string): Promise<Recipe | undefined> {
  const db = await getDb();
  return db.get(STORE, id);
}

export async function listRecipes(): Promise<Recipe[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex(STORE, "by-updated");
  return all.reverse();
}

export async function deleteRecipe(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE, id);
}
