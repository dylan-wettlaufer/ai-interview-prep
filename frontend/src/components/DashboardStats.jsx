import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, Target } from "lucide-react";

export default function DashboardStats({summary}) {

  const stats = [
    {
      title: "Total Interviews",
      value: summary.total_interviews || 0,
      change: "+3 this week",
      icon: Target,
      gradient: "bg-primary"
    },
    {
      title: "In Progress", 
      value: summary.in_progress_count || 0,
      change: "Active sessions",
      icon: Clock,
      gradient: "bg-primary"
    },
    {
      title: "Completed",
      value: summary.completed_count || 0, 
      change: "67% success rate",
      icon: CheckCircle,
      gradient: "bg-primary"
    },
    {
      title: "Completion Rate",
      value: summary.completion_rate + "%" || 0,
      change: "+0.5 improvement",
      icon: TrendingUp,
      gradient: "bg-primary"
    }
  ];


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.gradient}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}