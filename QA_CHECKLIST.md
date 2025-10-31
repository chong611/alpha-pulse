# Alpha Pulse - Comprehensive QA Testing Checklist

## Input Fields Testing

### Keywords Field
- [ ] Accepts single keyword
- [ ] Accepts multiple keywords (comma-separated)
- [ ] Handles Chinese characters
- [ ] Handles special characters
- [ ] Empty field handling

### Tickers Field
- [ ] Accepts single ticker (e.g., TSLA)
- [ ] Accepts multiple tickers (comma-separated)
- [ ] Handles $TSLA format
- [ ] Handles NASDAQ:TSLA format
- [ ] Handles HK:0700 format
- [ ] Empty field handling

### Subreddits Field
- [ ] Accepts single subreddit
- [ ] Accepts multiple subreddits (comma-separated)
- [ ] Works with/without r/ prefix
- [ ] Empty field handling

### Custom URLs Field
- [ ] Accepts single URL
- [ ] Accepts multiple URLs (one per line)
- [ ] {query} placeholder replacement works
- [ ] RSS feeds parsed correctly
- [ ] HTML pages handled gracefully
- [ ] Invalid URLs show error

### Max Items Per Site
- [ ] Default value (50) works
- [ ] Min value (1) works
- [ ] Max value (500) works
- [ ] Invalid input handled

### Time Window
- [ ] Last 24 hours works
- [ ] Last 7 days works
- [ ] Last 30 days works
- [ ] Filtering applied correctly

### Language Selector
- [ ] Auto-detect works
- [ ] English (en) works
- [ ] Chinese (zh) works
- [ ] Japanese (ja) works

### Proxy Mode
- [ ] Checkbox toggles correctly
- [ ] Proxy URL field appears/disappears
- [ ] Default proxy works
- [ ] Custom proxy works

---

## Data Sources Testing

### Google News
- [ ] Fetches with English keywords
- [ ] Fetches with Chinese keywords
- [ ] Fetches with Japanese keywords
- [ ] Returns correct number of items (respects maxItems)
- [ ] Metadata extracted correctly (title, url, date, snippet)
- [ ] Language auto-detection works

### Reddit
- [ ] Fetches from specified subreddits
- [ ] Fetches with keywords
- [ ] Returns correct number of items
- [ ] Top 5 comments extracted
- [ ] Engagement metrics captured
- [ ] User-Agent headers work (no 403 errors)

### Yahoo Finance
- [ ] Fetches financial news
- [ ] Returns correct number of items
- [ ] Metadata extracted correctly
- [ ] No service errors

### MarketWatch
- [ ] Fetches top stories
- [ ] XML parsing works
- [ ] Returns correct number of items
- [ ] Metadata extracted correctly

### PR Newswire
- [ ] RSS feed accessible
- [ ] Returns correct number of items
- [ ] Metadata extracted correctly

### SEC EDGAR
- [ ] Fetches filings
- [ ] Returns correct number of items
- [ ] Metadata extracted correctly

---

## Filtering & Sorting Testing

### Source Filter
- [ ] "All Sources" shows all results
- [ ] Individual source selection works
- [ ] Filter updates count correctly

### Ticker Filter
- [ ] "All Tickers" shows all results
- [ ] Individual ticker selection works
- [ ] Filter updates count correctly

### Sentiment Filter
- [ ] "All" shows all results
- [ ] "Bullish" shows only bullish
- [ ] "Bearish" shows only bearish
- [ ] "Neutral" shows only neutral

### Buzz Score Slider
- [ ] Slider moves correctly
- [ ] Min value (0) works
- [ ] Max value (100) works
- [ ] Filters results correctly
- [ ] Count updates

### Sort Options
- [ ] Latest (newest first) works
- [ ] Oldest (oldest first) works
- [ ] Relevance (highest score first) works
- [ ] Source A-Z works
- [ ] Title A-Z works

---

## Sentiment Analysis Testing

### Sentiment Scoring
- [ ] Scores range from -1 to 1
- [ ] Bullish threshold (>0.15) correct
- [ ] Bearish threshold (<-0.15) correct
- [ ] Neutral range correct
- [ ] VADER lexicon applied
- [ ] Loughran-McDonald finance terms applied

### Buzz Score
- [ ] Calculated correctly
- [ ] Site normalization works
- [ ] Recency decay applied
- [ ] Range 0-100

### Relevance Score
- [ ] TF-IDF calculation works
- [ ] Title boost applied
- [ ] Keyword matching works
- [ ] Ticker matching works

### Trade Score
- [ ] Composite formula correct (0.45·buzz + 0.35·relevance + 0.20·sentiment)
- [ ] Range 0-100

---

## Export Features Testing

### CSV Export
- [ ] Button works
- [ ] File downloads
- [ ] Contains all filtered results
- [ ] Headers correct
- [ ] Data formatted correctly
- [ ] Special characters handled

### JSON Export
- [ ] Button works
- [ ] File downloads
- [ ] Contains all filtered results
- [ ] Valid JSON format
- [ ] All fields included

### Markdown Export
- [ ] Button works
- [ ] File downloads
- [ ] "Daily Trader Brief" format correct
- [ ] Market Mood Snapshot included
- [ ] Top 10 Bullish/Bearish tickers listed
- [ ] Notable Threads section populated
- [ ] Fresh Filings section populated
- [ ] Risk Flags section populated

### Webhook
- [ ] URL input field works
- [ ] POST request sent
- [ ] Payload contains filtered results
- [ ] Success/error message shown
- [ ] CORS handled correctly

### Copy to Clipboard
- [ ] Copy JSON button works
- [ ] Copy Markdown button works
- [ ] Clipboard contains correct data
- [ ] Success message shown

---

## Configuration Testing

### Save Configuration
- [ ] Button works
- [ ] Config saved to LocalStorage
- [ ] All fields saved (sources, keywords, tickers, subreddits, maxItems, timeWindow, customUrls, darkMode)

### Load Configuration
- [ ] Button works
- [ ] Config loaded from LocalStorage
- [ ] All fields restored correctly
- [ ] Checkboxes restored
- [ ] Dropdowns restored

### Reset to Defaults
- [ ] Button works
- [ ] All fields reset
- [ ] Confirmation dialog shown
- [ ] LocalStorage cleared

### Auto-Save on Change
- [ ] Settings persist across page reloads
- [ ] Dark mode persists
- [ ] Last query persists

---

## UI/UX Testing

### Dark Mode
- [ ] Toggle button works
- [ ] Colors switch correctly
- [ ] All text readable
- [ ] Persists across reloads
- [ ] LocalStorage updated

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Three-panel layout adapts

### Results Display
- [ ] Items render correctly
- [ ] Virtual scrolling works (1000+ items)
- [ ] Expandable comments work
- [ ] Sentiment badges colored correctly
- [ ] Buzz scores displayed
- [ ] Timestamps formatted correctly

### Summary Bar
- [ ] Total results count correct
- [ ] Sites done/total correct
- [ ] Elapsed time shown
- [ ] Last run timestamp correct

### Mini Dashboards
- [ ] Sentiment bar chart displays
- [ ] Ticker heat map displays
- [ ] Source mix pie chart displays
- [ ] Data updates on filter change

### Loading States
- [ ] "Running..." indicator shows
- [ ] Progress updates during fetch
- [ ] Spinner animates
- [ ] Button disabled during fetch

### Error Handling
- [ ] CORS errors shown gracefully
- [ ] 404 errors handled
- [ ] 403 errors handled
- [ ] Timeout errors handled
- [ ] Invalid input errors shown

---

## Performance Testing

### Speed
- [ ] Fetch completes in <10 seconds for 6 sources
- [ ] UI remains responsive during fetch
- [ ] Filtering is instant
- [ ] Sorting is instant
- [ ] No lag with 1000+ items

### Memory
- [ ] No memory leaks
- [ ] Virtual list handles large datasets
- [ ] Browser doesn't freeze

### Network
- [ ] Concurrent fetching works (max 3 simultaneous)
- [ ] Retry logic works (max 2 retries)
- [ ] Exponential backoff applied

---

## Edge Cases Testing

### Empty Results
- [ ] "No results" message shown
- [ ] Filters still work
- [ ] Export buttons disabled or show empty data

### All Sources Fail
- [ ] Error message shown
- [ ] Doesn't crash
- [ ] Can retry

### Special Characters
- [ ] Chinese characters in keywords
- [ ] Japanese characters in keywords
- [ ] Emoji in keywords
- [ ] Special symbols in tickers

### Large Datasets
- [ ] 1000+ items render correctly
- [ ] Virtual scrolling works
- [ ] Export still works
- [ ] No performance degradation

### Network Issues
- [ ] Slow network handled
- [ ] Timeout handled
- [ ] Offline mode shows error

---

## Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] No console errors

### Safari
- [ ] All features work
- [ ] No console errors

### Edge
- [ ] All features work
- [ ] No console errors

---

## Security Testing

### Input Validation
- [ ] XSS prevention in keywords
- [ ] XSS prevention in custom URLs
- [ ] SQL injection prevention (N/A for frontend)

### API Security
- [ ] No sensitive data exposed
- [ ] CORS configured correctly
- [ ] Rate limiting respected

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab navigation works
- [ ] Enter key submits
- [ ] Esc key closes modals
- [ ] Arrow keys work in dropdowns

### Screen Reader
- [ ] Labels present
- [ ] ARIA attributes correct
- [ ] Alt text on images

### Color Contrast
- [ ] Text readable in light mode
- [ ] Text readable in dark mode
- [ ] WCAG AA compliance

---

## Documentation Testing

### User Guide
- [ ] Accurate
- [ ] Complete
- [ ] Easy to follow

### Deployment Guide
- [ ] Steps work
- [ ] No missing information
- [ ] Troubleshooting helpful

### Data Sources Guide
- [ ] All sources documented
- [ ] Limitations explained
- [ ] Alternatives provided
