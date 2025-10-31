import { Request, Response } from 'express';
import { DOMParser } from '@xmldom/xmldom';
const parser = new DOMParser();

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

// Detect if query contains Chinese, Japanese, or Korean characters
function detectLanguage(text: string): { hl: string, gl: string, ceid: string } {
  const hasChinese = /[\u4e00-\u9fff]/.test(text);
  const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
  const hasKorean = /[\uac00-\ud7af]/.test(text);
  
  if (hasChinese) return { hl: 'zh-CN', gl: 'CN', ceid: 'CN:zh-Hans' };
  if (hasJapanese) return { hl: 'ja', gl: 'JP', ceid: 'JP:ja' };
  if (hasKorean) return { hl: 'ko', gl: 'KR', ceid: 'KR:ko' };
  return { hl: 'en-US', gl: 'US', ceid: 'US:en' };
}

async function fetchGoogleNews(query: string): Promise<NewsItem[]> {
  try {
    const lang = detectLanguage(query);
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${lang.hl}&gl=${lang.gl}&ceid=${lang.ceid}`;
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

async function fetchReddit(query: string, subreddits: string[], sort: string, timeRange: string, maxItems: number = 50): Promise<NewsItem[]> {
  try {
    // If subreddits specified, search within those subreddits; otherwise search all of Reddit
    let url: string;
    if (subreddits && subreddits.length > 0) {
      // Search within specific subreddits: r/wallstreetbets+stocks+investing
      const subredditStr = subreddits.join('+');
      // Reddit API max is 100 per request
      const limit = Math.min(maxItems, 100);
      url = `https://www.reddit.com/r/${subredditStr}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=${sort}&t=${timeRange}&limit=${limit}`;
    } else {
      // Search all of Reddit
      // Reddit API max is 100 per request
      const limit = Math.min(maxItems, 100);
      url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=${sort}&t=${timeRange}&limit=${limit}`;
    }
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
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

async function fetchReuters(query: string): Promise<NewsItem[]> {
  // Reuters no longer provides public RSS feeds
  // Users should use Custom URLs with their Reuters API key if available
  // Example: https://api.reuters.com/v1/search?q={query}&apikey=YOUR_KEY
  return [];
}

async function fetchMarketWatch(): Promise<NewsItem[]> {
  try {
    const url = 'https://feeds.content.dowjones.io/public/rss/mw_topstories';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items: NewsItem[] = [];
    
    const entries = doc.getElementsByTagName('item');
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const title = entry.getElementsByTagName('title')[0]?.textContent || '';
      const link = entry.getElementsByTagName('link')[0]?.textContent || '';
      const pubDate = entry.getElementsByTagName('pubDate')[0]?.textContent || '';
      const description = entry.getElementsByTagName('description')[0]?.textContent || '';
      const creatorNodes = entry.getElementsByTagName('creator');
      const creator = creatorNodes.length > 0 ? creatorNodes[0]?.textContent || '' : '';
      
      if (title && link) {
        items.push({
          title,
          url: link,
          datetime: pubDate ? new Date(pubDate) : new Date(),
          snippet: description,
          author: creator,
          source: 'marketwatch',
          site: 'marketwatch.com',
        });
      }
    }
    
    console.log(`MarketWatch: fetched ${items.length} items`);
    return items;
  } catch (error) {
    console.error('MarketWatch error:', error);
    return [];
  }
}

async function fetchPRNewswire(): Promise<NewsItem[]> {
  try {
    const url = 'https://www.prnewswire.com/rss/news-releases-list.rss';
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

// Fetch from custom URLs with {query} placeholder
async function fetchCustomUrl(url: string, query: string): Promise<NewsItem[]> {
  try {
    const finalUrl = url.replace('{query}', encodeURIComponent(query));
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('xml') || contentType.includes('rss')) {
      const xml = await response.text();
      const items = await parseRSS(xml);
      return items.map(item => ({
        ...item,
        source: 'custom',
        site: new URL(finalUrl).hostname,
      }));
    } else if (contentType.includes('json')) {
      const json = await response.json();
      // Try to parse common JSON structures (Reddit-style, Twitter-style, etc.)
      if (json.data && Array.isArray(json.data.children)) {
        // Reddit-style JSON
        return json.data.children.map((child: any) => ({
          title: child.data.title || '',
          url: child.data.url || '',
          datetime: new Date(child.data.created_utc * 1000).toISOString(),
          source: 'custom',
          site: new URL(finalUrl).hostname,
          snippet: child.data.selftext || '',
        }));
      }
      // Add more JSON parsers as needed
      return [];
    }
    return [];
  } catch (e) {
    console.error(`Custom URL error (${url}):`, e);
    return [];
  }
}

export async function handleFetchNews(req: Request, res: Response) {
  try {
    const { keywords = [], tickers = [], subreddits = [], timeWindow = '24h', maxItems = 50, sources = {}, customUrls = '' } = req.body;
    
    const query = [...keywords, ...tickers.map((t: string) => '$' + t)].join(' ');
    const allItems: NewsItem[] = [];
    const timeMap: Record<string, string> = { '24h': 'day', '7d': 'week', '30d': 'month', 'all': 'all' };
    
    const promises: Promise<NewsItem[]>[] = [];
    
    if (sources.googleNews && query) {
      promises.push(fetchGoogleNews(query));
    }
    
    if (sources.reddit && query) {
      promises.push(fetchReddit(query, subreddits, 'new', timeMap[timeWindow], maxItems));
      promises.push(fetchReddit(query, subreddits, 'relevance', timeMap[timeWindow], maxItems));
    }
    
    if (sources.yahooFinance && tickers.length > 0) {
      promises.push(fetchYahooFinance(tickers));
    }
    
    if (sources.reuters && query) {
      promises.push(fetchReuters(query));
    }
    
    if (sources.marketWatch) {
      promises.push(fetchMarketWatch());
    }
    
    if (sources.prNewswire) {
      promises.push(fetchPRNewswire());
    }
    
    if (sources.secEdgar) {
      promises.push(fetchSEC());
    }
    
    // Handle custom URLs
    if (customUrls && query) {
      const urls = Array.isArray(customUrls) 
        ? customUrls.filter((u: string) => u.trim())
        : customUrls.split('\n').filter((u: string) => u.trim());
      for (const url of urls) {
        promises.push(fetchCustomUrl(url.trim(), query));
      }
    }
    
    const results = await Promise.allSettled(promises);
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    }
    
    // Apply maxItems limit per source before deduplication
    const limitedItems: NewsItem[] = [];
    const itemsBySource = new Map<string, NewsItem[]>();
    
    // Group items by source
    for (const item of allItems) {
      const source = item.source;
      if (!itemsBySource.has(source)) {
        itemsBySource.set(source, []);
      }
      itemsBySource.get(source)!.push(item);
    }
    
    // Limit each source to maxItems
    Array.from(itemsBySource.entries()).forEach(([source, items]) => {
      limitedItems.push(...items.slice(0, maxItems));
    });
    
    // Deduplicate by URL
    const seen = new Set<string>();
    const uniqueItems = limitedItems.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
    
    // Sort by datetime (newest first)
    uniqueItems.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
    
    res.json({
      items: uniqueItems,
      totalCount: uniqueItems.length,
      sourcesQueried: promises.length,
    });
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
