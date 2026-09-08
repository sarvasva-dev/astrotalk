export type CachedEntry = {
  key: string;
  response: string;
  intent: string;
  matchedRuleIds: string[];
  createdAt: number;
  hitsCount: number;
};

class AstrologyCacheLayer {
  private cache = new Map<string, CachedEntry>();
  private maxEntries = 200;

  private generateKey(chartId: string, intent: string, normalizedQuestion: string): string {
    const qClean = normalizedQuestion.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40);
    return `${chartId}_${intent}_${qClean}`;
  }

  public get(chartId: string, intent: string, question: string): CachedEntry | null {
    const key = this.generateKey(chartId, intent, question);
    const entry = this.cache.get(key);
    if (entry) {
      entry.hitsCount += 1;
      return entry;
    }
    return null;
  }

  public set(
    chartId: string,
    intent: string,
    question: string,
    response: string,
    matchedRuleIds: string[]
  ): void {
    if (this.cache.size >= this.maxEntries) {
      // Evict oldest
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    const key = this.generateKey(chartId, intent, question);
    this.cache.set(key, {
      key,
      response,
      intent,
      matchedRuleIds,
      createdAt: Date.now(),
      hitsCount: 1,
    });
  }

  public getStats() {
    let totalHits = 0;
    this.cache.forEach((entry) => {
      totalHits += entry.hitsCount - 1;
    });
    return {
      size: this.cache.size,
      totalHits,
    };
  }

  public clear() {
    this.cache.clear();
  }
}

export const astrologyCache = new AstrologyCacheLayer();
