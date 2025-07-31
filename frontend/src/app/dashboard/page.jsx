import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // The middleware will handle all authentication and redirects.
  // This component is only rendered if the user is authenticated.
  return <DashboardClient />;
}