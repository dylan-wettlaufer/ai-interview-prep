"use client"

import { useState } from "react"
import { Trophy, Target, CheckCircle, XCircle, Lightbulb, ThumbsUp, ThumbsDown, BookOpen, Clock, Home, Download, Share2, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InterviewResults({ interview, feedback }) {

    const totalTimeSpent = "10:15"
    const averageTimePerQuestion = "3:25"
    const overallScore = "85"

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-blue-50 border-blue-200"
        if (score >= 60) return "bg-yellow-50 border-yellow-200"
        return "bg-red-50 border-red-200"
      }

    const getScoreColor = (score) => {
        if (score >= 80) return "text-blue-950"
        if (score >= 60) return "text-yellow-600"
        return "text-red-600"
      }

      // sum overall feedback score from all three responses
      const sumOverallFeedbackScore = () => {
        let sum = 0;
        if (!feedback) return sum;
        for (const key in feedback.feedback_by_question) {
            const item = feedback.feedback_by_question[key];
            if (item?.feedback?.overall_score !== undefined) {
                sum += Number(item.feedback.overall_score);
            }
        }
        return ((sum / 300) * 100).toFixed(1);
    };

    const sumCategoryFeedbackScore = () => {
        let content_sum = 0;
        let clarity_sum = 0;
        let completeness_sum = 0;
        if (!feedback) return 0;
        for (const key in feedback.feedback_by_question) {
            const item = feedback.feedback_by_question[key];
            content_sum += item.feedback.content_quality;
            clarity_sum += item.feedback.clarity;
            completeness_sum += item.feedback.completeness;
        }
        return {"content_score":((content_sum/30)*100).toFixed(1), "clarity_score":((clarity_sum/30)*100).toFixed(1), "completeness_score":((completeness_sum/30)*100).toFixed(1)};
    };

    const getPerformanceLevel = (score) => {
        if (score >= 90) return "Excellent";
        if (score >= 80) return "Good";
        if (score >= 70) return "Average";
        if (score >= 60) return "Below Average";
        return "Poor";
    };

    // Loading state
    if (!interview || !feedback) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-6">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-blue-950" />
                    </div>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-950 mb-2">Interview Complete!</h1>
                    <p className="text-lg text-slate-600">Here's how you performed in your {interview.job_type} mock interview</p>
                </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Overall Performance Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="h-32 border-slate-200 shadow-sm">
                        <CardContent className="pt-2 text-center">
                            <div className={`text-4xl font-bold ${getScoreColor(sumOverallFeedbackScore())} mb-2`}>{sumOverallFeedbackScore()}</div>
                            <div className="text-sm text-slate-600 mb-2 gap-4">Overall Score <Badge variant="outline" className="text-blue-950 border-blue-950">
                            {getPerformanceLevel(sumOverallFeedbackScore())}
                            </Badge></div>
                        </CardContent>
                        </Card>

                        <Card className="h-32 border-slate-200 shadow-sm">
                        <CardContent className="pt-2 text-center">
                            <div className="text-2xl font-bold text-blue-950 mb-2">{totalTimeSpent}</div>
                            <div className="text-sm text-slate-600">Total Time</div>
                        </CardContent>
                        </Card>

                        <Card className="h-32 border-slate-200 shadow-sm">
                        <CardContent className="pt-2 text-center">
                            <div className="text-2xl font-bold text-blue-950 mb-2">{averageTimePerQuestion}</div>
                            <div className="text-sm text-slate-600">Avg per Question</div>
                        </CardContent>
                        </Card>

                        <Card className="h-32 border-slate-200 shadow-sm">
                        <CardContent className="pt-2 text-center">
                            <div className="text-2xl font-bold text-blue-950 mb-2">3/3</div>
                            <div className="text-sm text-slate-600">Questions Completed</div>
                        </CardContent>
                        </Card>
                    </div>

                    {/* Performance Breakdown */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                        <CardTitle className="flex items-center text-blue-950">
                            <Target className="h-5 w-5 mr-2" />
                            Performance Breakdown
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Content Quality</span>
                                <span className="font-medium text-blue-950">{sumCategoryFeedbackScore().content_score}%</span>
                            </div>
                            <Progress value={sumCategoryFeedbackScore().content_score} className="h-2" />
                            </div>
                            <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Clarity</span>
                                <span className="font-medium text-blue-950">{sumCategoryFeedbackScore().clarity_score}%</span>
                            </div>
                            <Progress value={sumCategoryFeedbackScore().clarity_score} className="h-2" />
                            </div>
                            <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Completeness</span>
                                <span className="font-medium text-blue-950">{sumCategoryFeedbackScore().completeness_score}%</span>
                            </div>
                            <Progress value={sumCategoryFeedbackScore().completeness_score} className="h-2" />
                            </div>
                        </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Question Results */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                        <CardTitle className="flex items-center text-blue-950">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Question-by-Question Analysis
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="question-1">Question 1</TabsTrigger>
                            <TabsTrigger value="question-2">Question 2</TabsTrigger>
                            <TabsTrigger value="question-3">Question 3</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4 pt-4">
                            {Object.values(feedback.feedback_by_question || {}).map((result) => (
                                <Card key={result.question_number} className={`${getScoreBg(result.feedback.overall_score)}`}>
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <Badge variant="outline" className="border-slate-300 bg-white">Question {result.question_number}</Badge>
                                        <Badge variant="outline" className="flex items-center space-x-1 border-slate-300 bg-white">
                                        <Clock className="h-3 w-3" />
                                        <span>2:00</span>
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-2xl font-bold ${getScoreColor(result.feedback.overall_score)}`}>{result.feedback.overall_score}</span>
                                        <span className="text-slate-500">/100</span>
                                    </div>
                                    </div>
                                    <p className="text-md text-slate-700 mb-3 line-clamp-2">{interview.questions[result.question_number - 1].question}</p>
                                    
                                </CardContent>
                                </Card>
                            ))}
                            </TabsContent>

                            {Object.values(feedback.feedback_by_question || {}).map((result) => (
                            <TabsContent key={result.question_number} value={`question-${result.question_number}`} className="space-y-6 pt-4">
                                {/* Question Header */}
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className="border-slate-300 bg-white">Question {result.question_number}</Badge>
                                    <div className="flex items-center space-x-4">
                                    <Badge variant="outline" className="flex items-center space-x-1 border-slate-300 bg-white">
                                        <Clock className="h-3 w-3" />
                                        <span>2:00</span>
                                    </Badge>
                                    <span className={`text-2xl font-bold ${getScoreColor(result.feedback.overall_score)}`}>
                                        {result.feedback.overall_score}/100
                                    </span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-blue-950">{interview.questions[result.question_number - 1].question}</h3>
                                </div>

                                {/* Your Response */}
                                <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg text-blue-950">Your Response</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <p className="text-blue-950 leading-relaxed">{result.response}</p>
                                    </div>

                                    {/* Detailed Scores */}
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-950">{result.feedback.content_quality}/10</div>
                                        <div className="text-sm text-slate-600">Content Quality</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-950">{result.feedback.clarity}/10</div>
                                        <div className="text-sm text-slate-600">Clarity</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-950">
                                        {result.feedback.completeness}/10
                                        </div>
                                        <div className="text-sm text-slate-600">Completeness</div>
                                    </div>
                                    </div>
                                </CardContent>
                                </Card>

                                {/* Feedback */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Positive Feedback */}
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                    <CardTitle className="text-lg flex items-center text-blue-950">
                                        <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
                                        What You Did Well
                                    </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-start space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-600">{result.feedback.positive_feedback}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Areas for Improvement */}
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                    <CardTitle className="text-lg flex items-center text-blue-950">
                                        <ThumbsDown className="h-5 w-5 mr-2 text-red-500" />
                                        Areas for Improvement
                                    </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-start space-x-2">
                                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-600">{result.feedback.negative_feedback}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                </div>

                                {/* Next Steps */}
                                <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center text-blue-950">
                                    <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
                                    Recommended Next Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                    {result.feedback.improvement_suggestions.map((step, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-blue-950">{index + 1}</span>
                                        </div>
                                        <span className="text-sm text-slate-700">{step}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </CardContent>
                                </Card>
                            </TabsContent>
                            ))}
                        </Tabs>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-blue-950">
                            <Home className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        </Link>
                        
                        <Button className="w-full flex-1 bg-blue-950 hover:bg-blue-900 text-white">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retake Interview
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}   