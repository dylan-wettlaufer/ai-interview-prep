import { getCompletedInterviews } from "@/utils/fetch-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Award, ChevronRight, BookOpen, Search, Filter, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
    const response = await getCompletedInterviews();
    const completedInterviews = response.data || [];

    const getScoreStyles = (score) => {
        if (score >= 80) return { 
            text: "text-emerald-600", 
            badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
            label: "Excellent"
        };
        if (score >= 60) return { 
            text: "text-amber-600", 
            badge: "bg-amber-50 text-amber-700 border-amber-200",
            label: "Good"
        };
        return { 
            text: "text-rose-600", 
            badge: "bg-rose-50 text-rose-700 border-rose-200",
            label: "Needs Work"
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/30">
            <main className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-12">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-950/60 font-medium text-sm mb-1">
                            <Clock className="h-4 w-4" />
                            <span>Past Performance</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-blue-950 tracking-tight">Interview History</h1>
                        <p className="text-slate-500 text-lg">Track your improvement and review expert feedback from previous sessions.</p>
                    </div>
                    <Link href="/interview/create">
                        <Button size="lg" className="bg-blue-950 hover:bg-blue-900 text-white shadow-lg shadow-blue-950/10 px-8 rounded-xl h-12">
                            Start New Session
                        </Button>
                    </Link>
                </div>

                {completedInterviews.length === 0 ? (
                    <Card className="border-dashed border-2 border-slate-200 bg-white/50 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center justify-center py-20">
                            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
                                <BookOpen className="h-10 w-10 text-blue-950/40" />
                            </div>
                            <h3 className="text-2xl font-bold text-blue-950 mb-3">Your history is empty</h3>
                            <p className="text-slate-500 text-center max-w-sm mb-10 leading-relaxed">
                                Once you complete an AI-powered interview session, your results and detailed feedback will appear here.
                            </p>
                            <Link href="/interview/create">
                                <Button className="bg-blue-950 hover:bg-blue-900 px-10 rounded-xl h-12 shadow-md">
                                    Start Your First Interview
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Summary - Optional quick view */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <Card className="border-slate-100 bg-white shadow-sm">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-blue-950" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Total Sessions</p>
                                        <p className="text-2xl font-bold text-blue-950">{completedInterviews.length}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* You could add more quick stats here if desired */}
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            {completedInterviews.map((interview) => {
                                const styles = getScoreStyles(interview.average_score);
                                return (
                                    <Link key={interview.id} href={`/interview/${interview.id}`} className="block group">
                                        <Card className="border-slate-200/60 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden rounded-xl">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row md:items-stretch">
                                                    {/* Score Section */}
                                                    <div className="bg-white md:w-32 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 transition-colors">
                                                        <div className="relative">
                                                            <svg className="w-16 h-16 transform -rotate-90">
                                                                <circle
                                                                    cx="32"
                                                                    cy="32"
                                                                    r="28"
                                                                    stroke="currentColor"
                                                                    strokeWidth="3.5"
                                                                    fill="transparent"
                                                                    className="text-slate-100"
                                                                />
                                                                <circle
                                                                    cx="32"
                                                                    cy="32"
                                                                    r="28"
                                                                    stroke="currentColor"
                                                                    strokeWidth="3.5"
                                                                    fill="transparent"
                                                                    strokeDasharray={176}
                                                                    strokeDashoffset={176 - (176 * interview.average_score) / 100}
                                                                    className={`${styles.text} transition-all duration-1000 ease-out`}
                                                                />
                                                            </svg>
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                                <span className={`text-xl font-black ${styles.text}`}>
                                                                    {interview.average_score}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className={`${styles.badge} mt-3 font-bold text-[9px] uppercase tracking-widest px-2 border-opacity-50`}>
                                                            {styles.label}
                                                        </Badge>
                                                    </div>

                                                    {/* Details Section */}
                                                    <div className="flex-1 p-6">
                                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                            <div className="space-y-3">
                                                                <div className="space-y-0.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="font-bold text-blue-950 text-xl tracking-tight group-hover:text-blue-900 transition-colors">
                                                                            {interview.job_type}
                                                                        </h3>
                                                                        <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[9px] uppercase px-2 font-bold h-4">
                                                                            {interview.difficulty_level}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-slate-400 text-xs font-medium flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        {formatDate(interview.completed_at)}
                                                                    </p>
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/50 rounded-md text-blue-950/70 text-xs font-semibold border border-blue-100/50">
                                                                        <Award className="h-3.5 w-3.5 text-blue-950/40" />
                                                                        {interview.interview_type}
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-md text-slate-500 text-xs font-semibold border border-slate-100">
                                                                        <Search className="h-3.5 w-3.5 text-slate-300" />
                                                                        {interview.interview_source}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-950 group-hover:text-white transition-all duration-300 shadow-inner">
                                                                    <ChevronRight className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

