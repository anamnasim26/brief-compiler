"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createEmptyRecipe, type Recipe } from "@/lib/schema/recipe";
import { deleteRecipe as deleteRecipeFromStore, getRecipe, listRecipes, saveRecipe } from "./recipe-store";

export function useRecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const all = await listRecipes();
    setRecipes(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const all = await listRecipes();
      if (cancelled) return;
      setRecipes(all);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { recipes, loading, refresh };
}

/**
 * Holds the recipe being worked on in the Flow A workspace. For a new
 * recipe, it's held in memory only until the designer's first real
 * change (picking an asset type, a swatch, ...) — that first `update`
 * is what persists it (IndexedDB), so merely opening the workspace
 * doesn't litter history with empty drafts. From then on every update
 * debounce-saves — matching R9's "recipe saved automatically". Pass an
 * existing recipe id to resume/adapt a saved recipe.
 */
export function useRecipeDraft(existingId?: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      if (existingId) {
        const found = await getRecipe(existingId);
        if (cancelled) return;
        setRecipe(found ?? createEmptyRecipe());
        setLoading(false);
        return;
      }
      const fresh = createEmptyRecipe();
      if (cancelled) return;
      setRecipe(fresh);
      setLoading(false);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [existingId]);

  const persist = useCallback((next: Recipe) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveRecipe(next).catch(() => {
        /* best-effort local persistence for a prototype */
      });
    }, 250);
  }, []);

  const update = useCallback(
    (updater: (prev: Recipe) => Recipe) => {
      setRecipe((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        next.updated_at = new Date().toISOString();
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const remove = useCallback(async () => {
    if (!recipe) return;
    await deleteRecipeFromStore(recipe.recipe_id);
  }, [recipe]);

  return { recipe, loading, update, remove };
}
