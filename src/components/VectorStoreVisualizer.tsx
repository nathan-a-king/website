import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Document {
  id: number;
  text: string;
  x: number;
  y: number;
  category: string;
  color: string;
}

interface SearchResult extends Document {
  distance: number;
  similarity: number;
}

const VectorStoreVisualizer = () => {
  const { isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(3);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState<Document | null>(null);
  const [queryVector, setQueryVector] = useState<{ x: number; y: number } | null>(null);

  // Pre-defined documents with simulated 2D embeddings
  // Using brand colors: blue (#2E5A91), purple (#9B8FD6), terracotta (#CC6B4A)
  const documents: Document[] = [
    // AI/ML cluster
    { id: 1, text: "Neural networks learn patterns from data", x: 150, y: 180, category: "AI/ML", color: "#2E5A91" },
    { id: 2, text: "Transformers use attention mechanisms", x: 170, y: 150, category: "AI/ML", color: "#2E5A91" },
    { id: 3, text: "Deep learning requires large datasets", x: 130, y: 160, category: "AI/ML", color: "#2E5A91" },
    { id: 4, text: "GPT models generate human-like text", x: 160, y: 200, category: "AI/ML", color: "#2E5A91" },

    // Database cluster
    { id: 5, text: "SQL queries retrieve structured data", x: 400, y: 300, category: "Databases", color: "#10b981" },
    { id: 6, text: "NoSQL databases store unstructured data", x: 420, y: 280, category: "Databases", color: "#10b981" },
    { id: 7, text: "Database indexes speed up queries", x: 380, y: 320, category: "Databases", color: "#10b981" },

    // Web Dev cluster
    { id: 8, text: "React builds interactive user interfaces", x: 500, y: 150, category: "Web Dev", color: "#9B8FD6" },
    { id: 9, text: "CSS frameworks style web applications", x: 520, y: 180, category: "Web Dev", color: "#9B8FD6" },
    { id: 10, text: "REST APIs enable client-server communication", x: 480, y: 160, category: "Web Dev", color: "#9B8FD6" },

    // DevOps cluster
    { id: 11, text: "Docker containers package applications", x: 300, y: 80, category: "DevOps", color: "#f59e0b" },
    { id: 12, text: "Kubernetes orchestrates container deployments", x: 320, y: 100, category: "DevOps", color: "#f59e0b" },
    { id: 13, text: "CI/CD pipelines automate software delivery", x: 280, y: 90, category: "DevOps", color: "#f59e0b" },

    // Algorithms cluster
    { id: 14, text: "Binary search efficiently finds elements", x: 250, y: 280, category: "Algorithms", color: "#CC6B4A" },
    { id: 15, text: "Sorting algorithms organize data collections", x: 270, y: 300, category: "Algorithms", color: "#CC6B4A" },
  ];

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const simulateEmbedding = (text: string): { x: number; y: number } => {
    // Simple keyword-based positioning simulation
    const keywords = {
      'neural|network|deep|learning|AI|model|GPT|transformer|attention': { x: 150, y: 170 },
      'database|SQL|NoSQL|query|index|data': { x: 400, y: 300 },
      'react|web|CSS|frontend|UI|API|REST': { x: 500, y: 165 },
      'docker|kubernetes|container|deploy|CI/CD|devops': { x: 300, y: 90 },
      'algorithm|sort|search|binary|efficiency': { x: 260, y: 290 },
    };

    const lowerText = text.toLowerCase();
    for (const [pattern, pos] of Object.entries(keywords)) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(lowerText)) {
        return {
          x: pos.x + (Math.random() - 0.5) * 40,
          y: pos.y + (Math.random() - 0.5) * 40
        };
      }
    }

    // Default random position
    return {
      x: 200 + Math.random() * 300,
      y: 100 + Math.random() * 250
    };
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    setIsSearching(true);
    const queryPos = simulateEmbedding(query);
    setQueryVector(queryPos);

    // Save current scroll position
    const scrollY = window.scrollY;

    // Calculate distances to all documents
    const results = documents.map(doc => ({
      ...doc,
      distance: calculateDistance(queryPos.x, queryPos.y, doc.x, doc.y),
      similarity: 1 / (1 + calculateDistance(queryPos.x, queryPos.y, doc.x, doc.y) / 100)
    }));

    // Sort by distance and take top K
    results.sort((a, b) => a.distance - b.distance);

    setTimeout(() => {
      setSearchResults(results.slice(0, topK));
      setIsSearching(false);
      // Restore scroll position after results render
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }, 500);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setQueryVector(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-brand-surface dark:bg-brand-surface rounded-lg shadow-card">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-brand-text-primary mb-2">Vector Store Visualizer</h2>
        <p className="text-brand-text-secondary">See how semantic search finds similar documents in vector space</p>
      </div>

      {/* Visualization Panel */}
      <div className="bg-brand-bg dark:bg-brand-bg rounded-lg shadow-sm border border-brand-border p-4 mb-4">
        <div className="relative" style={{ height: '400px' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" className="border border-brand-border rounded">
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDarkMode ? "rgba(250, 249, 245, 0.08)" : "rgba(31, 30, 29, 0.08)"} strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="600" height="400" fill="url(#grid)" />

            {/* Connection lines from query to results */}
            {queryVector && searchResults.map((result) => (
              <line
                key={`line-${result.id}`}
                x1={queryVector.x}
                y1={queryVector.y}
                x2={result.x}
                y2={result.y}
                stroke={result.color}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.5"
                className="animate-pulse"
              />
            ))}

            {/* Document vectors */}
            {documents.map(doc => {
              const isResult = searchResults.some(r => r.id === doc.id);
              return (
                <g key={doc.id}>
                  <circle
                    cx={doc.x}
                    cy={doc.y}
                    r={isResult ? 10 : 6}
                    fill={doc.color}
                    opacity={isResult ? 1 : 0.6}
                    onMouseEnter={() => setHoveredDoc(doc)}
                    onMouseLeave={() => setHoveredDoc(null)}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter: isResult ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none'
                    }}
                  />
                  {isResult && (
                    <text
                      x={doc.x}
                      y={doc.y - 15}
                      textAnchor="middle"
                      className="text-xs font-semibold"
                      fill={isDarkMode ? "#FFFFFF" : "#141413"}
                    >
                      {searchResults.findIndex(r => r.id === doc.id) + 1}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Query vector */}
            {queryVector && (
              <g>
                <circle
                  cx={queryVector.x}
                  cy={queryVector.y}
                  r="8"
                  fill="#CC6B4A"
                  className="animate-pulse"
                />
                <text
                  x={queryVector.x}
                  y={queryVector.y - 15}
                  textAnchor="middle"
                  className="text-sm font-semibold"
                  fill="#CC6B4A"
                >
                  Query
                </text>
              </g>
            )}
          </svg>

          {/* Hover tooltip */}
          {hoveredDoc && (
            <div className="absolute bg-brand-text-primary text-brand-bg text-xs p-2 rounded shadow-md max-w-xs pointer-events-none"
                 style={{ left: hoveredDoc.x + 10, top: hoveredDoc.y - 40 }}>
              <div className="font-semibold">{hoveredDoc.category}</div>
              <div>{hoveredDoc.text}</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {[...new Set(documents.map(d => d.category))].map(category => {
            const doc = documents.find(d => d.category === category);
            if (!doc) return null;
            return (
              <div key={category} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: doc.color }}></div>
                <span className="text-xs text-brand-text-secondary">{category}</span>
              </div>
            );
          })}
          {queryVector && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#CC6B4A' }}></div>
              <span className="text-xs text-brand-text-secondary">Query Vector</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-brand-bg dark:bg-brand-bg rounded-lg shadow-sm border border-brand-border p-4 mb-4">
          <h3 className="text-sm font-semibold text-brand-text-primary mb-3">
            Search Results
          </h3>
          <div className="space-y-3">
            {searchResults.map((result, idx) => (
              <div
                key={result.id}
                className="p-3 border-l-4 border-brand-terracotta bg-brand-surface dark:bg-brand-surface rounded"
              >
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-brand-text-primary">#{idx + 1}</span>
                  <div className="flex-1">
                    <div className="text-sm text-brand-text-primary">{result.text}</div>
                    <div className="text-xs text-brand-text-secondary mt-1">
                      Similarity: {(result.similarity * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-brand-text-tertiary">
                      {result.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Controls - Now at the bottom */}
      <div className="bg-brand-bg dark:bg-brand-bg rounded-lg shadow-sm border border-brand-border p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">
              Search Query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., machine learning models"
                className="flex-1 px-3 py-2 border border-brand-border bg-brand-bg text-brand-text-primary placeholder:text-brand-text-tertiary rounded focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="p-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-semibold text-brand-text-primary mb-2">
              Top K Results: {topK}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full accent-brand-terracotta"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="w-full md:w-auto px-6 py-2 bg-brand-terracotta text-white rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <Search size={16} />
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-brand-surface dark:bg-brand-surface border border-brand-border rounded-lg p-4">
        <h3 className="font-semibold text-brand-text-primary mb-2">How it works:</h3>
        <ul className="text-sm text-brand-text-secondary space-y-1">
          <li>• Each document is converted to a vector (point in space) based on its meaning</li>
          <li>• Similar documents cluster together in vector space</li>
          <li>• Search queries are also converted to vectors</li>
          <li>• The system finds documents closest to the query vector</li>
          <li>• Distance in space = semantic similarity in meaning</li>
        </ul>
      </div>
    </div>
  );
};

export default VectorStoreVisualizer;
