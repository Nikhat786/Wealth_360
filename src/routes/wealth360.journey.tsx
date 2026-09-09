import { createFileRoute } from "@tanstack/react-router";

import { Onboarding } from "@/routes/onboarding";

export const Route = createFileRoute("/wealth360/journey")({
  component: Onboarding,
});
