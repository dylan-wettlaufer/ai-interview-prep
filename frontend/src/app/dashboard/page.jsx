import DashboardStats from "@/components/DashboardStats";
import InterviewProgress from "@/components/InterviewProgress";
import TimeBasedGreeting from "@/components/TimeBasedGreeting";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getInterviewSummary, getInProgressInterviews, getUserProfile } from "@/utils/fetch-api";
import { Suspense } from "react";
import DashboardStatsSkeleton from "@/components/DashboardStatsSkeleton";
import InterviewProgressSkeleton from "@/components/InterviewProgressSkeleton";

async function DashboardStatsLoader() {
  const summary = await getInterviewSummary();
  const in_progress = await getInProgressInterviews();
  return <div><DashboardStats summary={summary} /> <InterviewProgress in_progress={in_progress} /></div>;
}

async function InterviewProgressLoader() {
  const in_progress = await getInProgressInterviews();
  return <InterviewProgress in_progress={in_progress} />;
}

export default async function DashboardPage() {
  const userProfile = await getUserProfile();
  const firstName = userProfile?.user_metadata?.first_name || "";

  return (
    <div className="min-h-screen bg-white">
          <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
              <TimeBasedGreeting initialName={firstName} />
              <Link href="/interview/create">
                <Button className="bg-blue-950 hover:bg-blue-900 text-white" size="lg" >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Interview
                </Button>
              </Link>
              </div>

              <Suspense fallback={<div><DashboardStatsSkeleton /> <InterviewProgressSkeleton /></div>}>
                <DashboardStatsLoader />
              </Suspense>
            </div>
          </main>
        </div>
  )
}