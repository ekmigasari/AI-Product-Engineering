import { api } from "#/utils/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/research")({
  component: Research,
  loader: async () => {
    const res = await api.research.$get();
    const data = await res.json();
    return data;
  },
});

function Research() {
  Route.useLoaderData();

  const [targetMarket, setTargetMarket] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    id: number;
    perspective?: string | null;
    isDone: boolean;
  } | null>(null);

  async function handleStartResearch() {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await api.research.$post({
        json: {
          targetMarket,
          industry,
          location: location || undefined,
          additionalInfo: additionalInfo || undefined,
        },
      });
      const body = await res.json();
      if (!("customerResearchId" in body)) return;
      const { customerResearchId } = body;

      while (true) {
        await new Promise((r) => setTimeout(r, 2000));
        const pollRes = await api.research[":id"].$get({
          param: { id: String(customerResearchId) },
        });
        const research = await pollRes.json();
        if ("isDone" in research && research.isDone) {
          setResult(research);
          break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Research</h1>
          <p className="mt-2 text-gray-600">
            Get AI-powered insights for your target market
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStartResearch();
          }}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="targetMarket"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Target Market *
            </label>
            <input
              id="targetMarket"
              type="text"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Small businesses in Southeast Asia"
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Industry *
            </label>
            <input
              id="industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., E-commerce, SaaS, Healthcare"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Singapore, Global"
            />
          </div>

          <div>
            <label
              htmlFor="additionalInfo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Additional Info
            </label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any specific questions or focus areas..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !targetMarket || !industry}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Researching..." : "Start Research"}
          </button>
        </form>

        {result && (
          <div className="mt-8 bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Research Perspective
            </h2>
            <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-700">
              {result.perspective}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
