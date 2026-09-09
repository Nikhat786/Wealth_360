import { createFileRoute } from "@tanstack/react-router";

import { Analysis } from "@/routes/analysis";

export const Route = createFileRoute("/wealth360/analysis")({
  component: Analysis,
});
