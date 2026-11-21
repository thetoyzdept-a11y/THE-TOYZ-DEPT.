/**
 * Typo-Tolerant Fuzzy Search Engine using Dynamic Programming & N-Gram Indexing.
 *
 * Implements:
 * 1. Levenshtein Distance (Dynamic Programming O(m*n))
 * 2. Trigram Tokenization & Jaccard Overlap
 * 3. Weighted Relevance Scoring (Exact Match > Word Prefix > Trigram > Edit Distance)
 */

/**
 * Computes Levenshtein edit distance between strings a and b.
 * Uses 2-row rolling buffer for O(min(m,n)) memory optimization.
 */
export function levenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();

  if (s1 === s2) return 0;
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  let prev = Array(s2.length + 1).fill(0);
  let curr = Array(s2.length + 1).fill(0);

  for (let j = 0; j <= s2.length; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= s1.length; i++) {
    curr[0] = i;
    const c1 = s1.charCodeAt(i - 1);

    for (let j = 1; j <= s2.length; j++) {
      const c2 = s2.charCodeAt(j - 1);
      const cost = c1 === c2 ? 0 : 1;

      curr[j] = Math.min(
        prev[j] + 1,       // deletion
        curr[j - 1] + 1,   // insertion
        prev[j - 1] + cost // substitution
      );
    }

    // Swap row buffers
    const temp = prev;
    prev = curr;
    curr = temp;
  }

  return prev[s2.length];
}

/**
 * Extracts character n-grams of size n from text.
 */
export function getNGrams(text: string, n = 3): Set<string> {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, " ");
  const ngrams = new Set<string>();

  for (let i = 0; i <= clean.length - n; i++) {
    ngrams.add(clean.substring(i, i + n));
  }

  return ngrams;
}

/**
 * Computes Jaccard similarity coefficient between two strings based on trigrams.
 * Output is in range [0.0, 1.0].
 */
export function trigramSimilarity(a: string, b: string): number {
  if (a.toLowerCase() === b.toLowerCase()) return 1.0;

  const ngramsA = getNGrams(a, 3);
  const ngramsB = getNGrams(b, 3);

  if (ngramsA.size === 0 || ngramsB.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const gram of ngramsA) {
    if (ngramsB.has(gram)) {
      intersection++;
    }
  }

  const union = ngramsA.size + ngramsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export interface SearchableItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  material?: string | null;
  base_price?: number;
  primary_image?: string | null;
  category_name?: string | null;
  [key: string]: any;
}

export interface MatchResult<T> {
  item: T;
  score: number; // Higher is better (0 to 100)
  matchReason: "exact" | "prefix" | "substring" | "fuzzy" | "description";
}

/**
 * Scores and ranks candidate items against a user query using multi-tier DSA heuristics.
 */
export function fuzzyRankItems<T extends SearchableItem>(
  items: T[],
  rawQuery: string,
  minScoreThreshold = 25
): MatchResult<T>[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const queryTokens = query.split(/\s+/).filter(Boolean);
  const results: MatchResult<T>[] = [];

  for (const item of items) {
    const name = (item.name || "").toLowerCase();
    const material = (item.material || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const category = (item.category_name || "").toLowerCase();
    const nameTokens = name.split(/\s+/);

    let score = 0;
    let matchReason: MatchResult<T>["matchReason"] = "fuzzy";

    // 1. Exact string match
    if (name === query) {
      score = 100;
      matchReason = "exact";
    }
    // 2. Starts with query prefix
    else if (name.startsWith(query)) {
      score = 90;
      matchReason = "prefix";
    }
    // 3. Name contains query as whole substring
    else if (name.includes(query)) {
      score = 80;
      matchReason = "substring";
    }
    // 4. Token-by-token prefix matching
    else {
      let matchedTokens = 0;
      for (const qToken of queryTokens) {
        if (nameTokens.some((nToken) => nToken.startsWith(qToken))) {
          matchedTokens++;
        }
      }

      if (matchedTokens > 0) {
        score = 65 + (matchedTokens / queryTokens.length) * 15;
        matchReason = "prefix";
      } else {
        // 5. Trigram and Levenshtein distance check on title
        const triScore = trigramSimilarity(name, query);
        const dist = levenshteinDistance(name, query);
        const maxLen = Math.max(name.length, query.length);
        const normalizedLev = Math.max(0, 1 - dist / maxLen);

        const fuzzyComposite = triScore * 0.5 + normalizedLev * 0.5;

        // Also check if any single word in name is within edit distance of query
        let wordMinDist = 999;
        for (const word of nameTokens) {
          const d = levenshteinDistance(word, query);
          if (d < wordMinDist) wordMinDist = d;
        }

        if (wordMinDist <= 2 && query.length >= 3) {
          score = Math.max(50, 75 - wordMinDist * 12);
          matchReason = "fuzzy";
        } else if (fuzzyComposite >= 0.35) {
          score = Math.round(fuzzyComposite * 70);
          matchReason = "fuzzy";
        } else if (material.includes(query) || category.includes(query) || description.includes(query)) {
          score = 35;
          matchReason = "description";
        }
      }
    }

    if (score >= minScoreThreshold) {
      results.push({
        item,
        score,
        matchReason,
      });
    }
  }

  // Rank by descending score
  return results.sort((a, b) => b.score - a.score);
}
