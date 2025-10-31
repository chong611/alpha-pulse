import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, BarChart3, Zap } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container py-4">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Multi-Site Market News & Sentiment
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Scan fresh market news and social chatter with unified deduplication,
              sentiment analysis, and actionable insights for day traders.
            </p>
            <a href="/alpha-pulse.html" target="_blank">
              <Button size="lg" className="text-lg px-8 py-6">
                Launch Alpha Pulse
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multi-Source Aggregation</h3>
              <p className="text-gray-600">
                Fetch from X, Reddit, Google News, Yahoo Finance, Reuters, SEC EDGAR, and more.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-gray-600">
                Hybrid lexicon with VADER and Loughran-McDonald finance terms for accurate scoring.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <Zap className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-Time Insights</h3>
              <p className="text-gray-600">
                Trade scores, ticker heat maps, and exportable reports for fast decision-making.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>Powered by backend server • No CORS restrictions • Real-time data aggregation</p>
          </div>
        </div>
      </main>
    </div>
  );
}
