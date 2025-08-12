"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Star, AlertCircle, Lightbulb } from "lucide-react"

export default function InterviewFeedback({ response, feedback }) {

    const getScoreBadgeVariant = (score) => {
        if (score >= 80) return "default"
        if (score >= 60) return "secondary"
        return "destructive"
      }

    return (
        
        <div className="space-y-6">
              {/* Response Display */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Your Response</CardTitle>
                    <Badge variant={getScoreBadgeVariant(feedback.overall_score)} className="text-lg px-3 py-1">
                      {feedback.overall_score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 leading-relaxed">{response}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    AI Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Positive Feedback */}
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">What You Did Well</h4>
                        <p className="text-gray-700">{feedback.positive_feedback}</p>
                      </div>
                    </div>
                    
                    <Separator />

                    {/* Negative Feedback */}
                    {feedback.negative_feedback && (
                      <>
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Areas for Improvement</h4>
                            <p className="text-gray-700">{feedback.negative_feedback}</p>
                          </div>
                        </div>

                        <Separator />
                      </>
                    )}

                    {/* Suggested Improvements */}
                    {feedback.improvement_suggestions && (
                      <>
                        <div className="flex items-start space-x-3">
                          <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Suggested Improvements</h4>
                            {feedback.improvement_suggestions.map((suggestion, index) => (
                              <div key={index}>
                                <p className="text-gray-700">{index + 1}. {suggestion}</p>
                                <br />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />
                      </>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{feedback.content_quality}/10</div>
                        <div className="text-sm text-gray-600">Content Quality</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{feedback.clarity}/10</div>
                        <div className="text-sm text-gray-600">Clarity</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{feedback.completeness}/10</div>
                        <div className="text-sm text-gray-600">Completeness</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
            </div>

    );
}