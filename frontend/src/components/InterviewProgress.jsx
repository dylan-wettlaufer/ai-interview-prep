'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InterviewProgress({in_progress}) {
    const interviews = in_progress?.data || [];
    const router = useRouter();

    if (interviews.length === 0) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Interviews in Progress</h2>
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              You have no active interviews.
            </CardContent>
          </Card>
        </div>
      );
    }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Interviews in Progress</h2>
        <span className="text-sm text-muted-foreground">{interviews.length} active session{interviews.length === 1 ? '' : 's'}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {interviews.map((item, index) => (
          <Card key={item.interview.id} className="shadow-soft hover:shadow-medium transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">{item.interview.job_type}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{item.interview.interview_type} Interview</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.interview.completed === false 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-warning-light text-warning'
                }`}>
                  {item.interview.completed === false ? "In Progress" : "Paused"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{item.progress.progress_percentage}%</span>
                </div>
                <Progress value={item.progress.progress_percentage} className="h-3" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Interview Source:</span>
                  <span className="font-medium text-foreground">{item.interview.interview_source}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Difficulty Level:</span>
                  <span className="text-foreground">{item.interview.difficulty_level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Remaining:</span>
                  <span className="text-foreground">{item.progress.estimated_remaining_time} mins</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant='default' 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => router.push(`/interview/${item.interview.id}`)}
                >
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};