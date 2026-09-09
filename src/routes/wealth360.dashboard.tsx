import { createFileRoute } from "@tanstack/react-router";

import { Dashboard } from "@/routes/index";

export const Route = createFileRoute("/wealth360/dashboard")({
  component: Dashboard,
});
