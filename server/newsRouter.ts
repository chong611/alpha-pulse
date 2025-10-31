import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { DOMParser } from "@xmldom/xmldom";

// Input schema for news fetching
const fetchNewsInput = z.object({
  keywords: z.array(z.string()).optional(),
  tickers: z.array(z.string()).optional(),
  timeWindow: z.enum(["24h", "7d", "30d", "all"]).default("24h"),
  maxItems: z.number().default(50),
  sources: z.object({
    googleNews: z.boolean().default(true),
    reddit: z.boolean().default(true),
    yahooFinance: z.boolean().default(true),
    prNewswire: z.boolean().default(true),
    secEdgar: z.boolean().default(true),
  }).default({
    googleNews: true,
    reddit: true,
    yahooFinance: true,
    prNewswire: true,
    secEdgar: true,
  }),
});

interface NewsItem {
  title: string;
  url: string;
  datetime: Date;
  snippet: string;
  source: string;
  site: string;
  author?: string;
  engagement?: {
    score?: number;
    comments?: number;
  };
}

async function parseRSS(xml: string): Promise<Omit<NewsItem, 'source' | 'site'>[]> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items: Omit<NewsItem, 'source' | 'site'>[] = [];
  
  const itemNodes = doc.getElementsByTagName('item');
  const entryNodes = doc.getElementsByTagName('entry');
  const allNodes = [...Array.from(itemNodes), ...Array.from(entryNodes)];
  
  for (let i = 0; i < allNodes.length; i++) {
    const item = allNodes[i];
    const titleNode = item.getElementsByTagName('title')[0];
    const linkNode = item.getElementsByTagName('link')[0];
    const pubDateNode = item.getElementsByTagName('pubDate')[0] || item.getElementsByTagName('published')[0];
    const descNode = item.getElementsByTagName('description')[0] || item.getElementsByTagName('summary')[0];
    
    const title = titleNode?.textContent || '';
    let link = linkNode?.textContent || linkNode?.getAttribute('href') || '';
    const pubDate = pubDateNode?.textContent || '';
    const description = descNode?.textContent || '';
    
    if (title && link) {
      items.push({
        title: title.trim(),
        url: link.trim(),
        datetime: pubDate ? new Date(pubDate) : new Date(),
        snippet: description.replace(/<[^>]*>/g, '').substring(0, 300).trim(),
      });
    }
  }
  
  return items;
}

async function fetchGoogleNews(query: string): Promise<NewsItem[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const items = await parseRSS(xml);
    
    return items.map(item => ({
      ...item,
      source: 'google-news',
      site: 'news.google.com',
    }));
  } catch (e) {
    console.error('Google News error:', e);
    return [];
  }
}

async function fetchReddit(query: string, sort: string, timeRange: string): Promise<NewsItem[]> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=${sort}&t=${timeRange}&limit=50`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AlphaPulse/1.0',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    const posts = data?.data?.children || [];
    const items: NewsItem[] = [];
    
    for (const post of posts) {
      const p = post.data;
      items.push({
        title: p.title,
        url: 'https://reddit.com' + p.permalink,
        datetime: new Date(p.created_utc * 1000),
        snippet: (p.selftext || '').substring(0, 300),
        author: p.author,
        source: 'reddit',
        site: 'reddit.com',
        engagement: {
          score: p.score,
          comments: p.num_comments,
        },
      });
    }
    
    return items;
  } catch (e) {
    console.error('Reddit error:', e);
    return [];
  }
}

async function fetchYahooFinance(tickers: string[]): Promise<NewsItem[]> {
  if (!tickers || tickers.length === 0) return [];
  
  try {
    const tickerStr = tickers.join(',');
    const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${tickerStr}&region=US&lang=en-US`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const items = await parseRSS(xml);
    
    return items.map(item => ({
      ...item,
      source: 'yahoo-finance',
      site: 'finance.yahoo.com',
    }));
  } catch (e) {
    console.error('Yahoo Finance error:', e);
    return [];
  }
}

async function fetchPRNewswire(): Promise<NewsItem[]> {
  try {
    const url = 'https://www.prnewswire.com/rss/all-news.rss';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const items = await parseRSS(xml);
    
    return items.map(item => ({
      ...item,
      source: 'prnewswire',
      site: 'prnewswire.com',
    }));
  } catch (e) {
    console.error('PR Newswire error:', e);
    return [];
  }
}

async function fetchSEC(): Promise<NewsItem[]> {
  try {
    const url = 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&company=&dateb=&owner=include&start=0&count=40&output=atom';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AlphaPulse contact@example.com',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const items = await parseRSS(xml);
    
    return items.map(item => ({
      ...item,
      source: 'sec-edgar',
      site: 'sec.gov',
    }));
  } catch (e) {
    console.error('SEC EDGAR error:', e);
    return [];
  }
}

export const newsRouter = router({
  fetchNews: publicProcedure
    .input(fetchNewsInput)
    .query(async ({ input }) => {
      const { keywords = [], tickers = [], timeWindow, sources } = input;
      const query = [...keywords, ...tickers.map(t => '$' + t)].join(' ');
      
      const allItems: NewsItem[] = [];
      const timeMap = { '24h': 'day', '7d': 'week', '30d': 'month', 'all': 'all' };
      
      // Fetch from all enabled sources concurrently
      const promises: Promise<NewsItem[]>[] = [];
      
      if (sources.googleNews && query) {
        promises.push(fetchGoogleNews(query));
      }
      
      if (sources.reddit && query) {
        promises.push(fetchReddit(query, 'new', timeMap[timeWindow]));
        promises.push(fetchReddit(query, 'relevance', timeMap[timeWindow]));
      }
      
      if (sources.yahooFinance && tickers.length > 0) {
        promises.push(fetchYahooFinance(tickers));
      }
      
      if (sources.prNewswire) {
        promises.push(fetchPRNewswire());
      }
      
      if (sources.secEdgar) {
        promises.push(fetchSEC());
      }
      
      const results = await Promise.allSettled(promises);
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          allItems.push(...result.value);
        }
      }
      
      // Deduplicate by URL
      const seen = new Set<string>();
      const uniqueItems = allItems.filter(item => {
        if (seen.has(item.url)) return false;
        seen.add(item.url);
        return true;
      });
      
      // Sort by datetime (newest first)
      uniqueItems.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
      
      return {
        items: uniqueItems,
        totalCount: uniqueItems.length,
        sourcesQueried: promises.length,
      };
    }),
});
