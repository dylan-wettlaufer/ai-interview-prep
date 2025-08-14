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
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const totalTimeSpent = "10:15"
    const averageTimePerQuestion = "3:25"
    const overallScore = "85"

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-green-50 border-green-200"
        if (score >= 60) return "bg-yellow-50 border-yellow-200"
        return "bg-red-50 border-red-200"
      }

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600"
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
        return sum;
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
        return {"content_score":content_sum*10, "clarity_score":clarity_sum*10, "completeness_score":completeness_sum*10};
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-green-600" />
                    </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
                    <p className="text-lg text-gray-600">Here's how you performed in your {interview.job_type} mock interview</p>
                </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Overall Performance Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="h-32">
                        <CardContent className="pt-2 text-center">
                            <div className="text-4xl font-bold text-green-600 mb-2">{sumOverallFeedbackScore()}</div>
                            <div className="text-sm text-gray-600 mb-2 gap-4">Overall Score <Badge variant="outline" className="text-green-600 border-green-600">
                            {getPerformanceLevel(sumOverallFeedbackScore())}
                            </Badge></div>
                        </CardContent>
                        </Card>

                        <Card className="h-32">
                        <CardContent className="pt-2 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-2">{totalTimeSpent}</div>
                            <div className="text-sm text-gray-600">Total Time</div>
                        </CardContent>
                        </Card>

                        <Card className="h-32">
                        <CardContent className="pt-2 text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-2">{averageTimePerQuestion}</div>
                            <div className="text-sm text-gray-600">Avg per Question</div>
                        </CardContent>
                        </Card>

                        <Card className="h-32">
                        <CardContent className="pt-2 text-center">
                            <div className="text-2xl font-bold text-orange-600 mb-2">3/3</div>
                            <div className="text-sm text-gray-600">Questions Completed</div>
                        </CardContent>
                        </Card>
                    </div>

                    {/* Performance Breakdown */}
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            Performance Breakdown
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Content Quality</span>
                                <span className="font-medium">{sumCategoryFeedbackScore().content_score}%</span>
                            </div>
                            <Progress value={sumCategoryFeedbackScore().content_score} className="h-2" />
                            </div>
                            <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Clarity</span>
                                <span className="font-medium">{sumCategoryFeedbackScore().clarity_score}%</span>
                            </div>
                            <Progress value={sumCategoryFeedbackScore().clarity_score} className="h-2" />
                            </div>
                            <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Completeness</span>
                                <span className="font-medium">{sumCategoryFeedbackScore().completeness_score}%</span>
                            </div>
                            <Progress value={sumCategoryFeedbackScore().completeness_score} className="h-2" />
                            </div>
                        </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Question Results */}
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center">
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

                            <TabsContent value="overview" className="space-y-4">
                            {Object.values(feedback.feedback_by_question || {}).map((result) => (
                                <Card key={result.question_number} className={`${getScoreBg(result.feedback.overall_score)}`}>
                                <CardContent className="pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <Badge variant="outline">{result.feedback.overall_score}</Badge>
                                        <span className="font-medium">Question {result.question_number}</span>
                                        <Badge variant="outline" className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        2:00
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-2xl font-bold ${getScoreColor(result.feedback.overall_score)}`}>{result.feedback.overall_score}</span>
                                        <span className="text-gray-500">/100</span>
                                    </div>
                                    </div>
                                    <p className="text-md text-gray-700 mb-3 line-clamp-2">{interview.questions[result.question_number - 1].question}</p>
                                    
                                </CardContent>
                                </Card>
                            ))}
                            </TabsContent>

                            {Object.values(feedback.feedback_by_question || {}).map((result) => (
                            <TabsContent key={result.question_number} value={`question-${result.question_number}`} className="space-y-6">
                                {/* Question Header */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline">Question {result.question_number}</Badge>
                                    <div className="flex items-center space-x-4">
                                    <Badge variant="outline" className="flex items-center space-x-1">
                                        <Clock className="h-3 w-3" />
                                        2:00
                                    </Badge>
                                    <span className={`text-2xl font-bold ${getScoreColor(result.feedback.overall_score)}`}>
                                        {result.feedback.overall_score}/100
                                    </span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{interview.questions[result.question_number - 1].question}</h3>
                                </div>

                                {/* Your Response */}
                                <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Your Response</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <p className="text-gray-800 leading-relaxed">{result.response}</p>
                                    </div>

                                    {/* Detailed Scores */}
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-600">{result.feedback.content_quality}/10</div>
                                        <div className="text-sm text-gray-600">Content Quality</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-600">{result.feedback.clarity}/10</div>
                                        <div className="text-sm text-gray-600">Clarity</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-yellow-600">
                                        {result.feedback.completeness}/10
                                        </div>
                                        <div className="text-sm text-gray-600">Completeness</div>
                                    </div>
                                    </div>
                                </CardContent>
                                </Card>

                                {/* Feedback */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Positive Feedback */}
                                <Card className="border-green-200">
                                    <CardHeader>
                                    <CardTitle className="text-lg flex items-center text-green-700">
                                        <ThumbsUp className="h-5 w-5 mr-2" />
                                        What You Did Well
                                    </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-start space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-600">{result.feedback.positive_feedback}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Areas for Improvement */}
                                <Card className="border-red-200">
                                    <CardHeader>
                                    <CardTitle className="text-lg flex items-center text-red-700">
                                        <ThumbsDown className="h-5 w-5 mr-2" />
                                        Areas for Improvement
                                    </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-start space-x-2">
                                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-600">{result.feedback.negative_feedback}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                                </div>

                                {/* Next Steps */}
                                <Card className="border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center text-blue-700">
                                    <Lightbulb className="h-5 w-5 mr-2" />
                                    Recommended Next Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                    {result.feedback.improvement_suggestions.map((step, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                                        </div>
                                        <span className="text-sm text-gray-700">{step}</span>
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
                        <Button variant="outline" className="w-full bg-transparent">
                            <Home className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                        </Link>
                        <Button variant="outline" className="flex-1 bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Results
                        </Button>
                        <Button className="w-full flex-1">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Retake Interview
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
}   