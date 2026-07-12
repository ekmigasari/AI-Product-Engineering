import { api } from "#/utils/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/research")({
  component: Home,
  loader: async () => {
    const res = await api.research.$get();
    const data = await res.json();
    return data;
  },
});

function Home() {
  const data = Route.useLoaderData();

  const [jobTitle, setJobtitle] = useState("");
  const [level, setLevel] = useState("junior");
  const [industry, setIndustry] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  async function handleStartResearch() {
    const res = await api.research.$post({
      json: {
        jobTitle,
        level,
        industry,
        additionalInfo,
      },
    });
    const data = await res.json();
    console.log(data);
  }

  return (
    <div className="p-8">
      <section>
        <input
          type="text"
          placeholder="Job Title"
          onChange={(e) => setJobtitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Level"
          onChange={(e) => setLevel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Industry"
          onChange={(e) => setIndustry(e.target.value)}
        />
        <input
          type="text"
          placeholder="Additional Info"
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
        <button onClick={handleStartResearch}>Start Research</button>
      </section>
      <section>
        <h1 className="text-4xl font-bold">{data.message}</h1>
        <h1 className="text-4xl font-bold">{data.appName}</h1>
      </section>
    </div>
  );
}
