"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Star, SkipForward, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function InterviewFeedback({ question_number, num_questions }) {

    const [score, setScore] = useState(55);
    const [userResponse, setUserResponse] = useState("This is a sample response.");
    const [feedback, setFeedback] = useState("This is a sample feedback.");

    const getScoreBadgeVariant = (score) => {
        if (score >= 80) return "default"
        if (score >= 60) return "secondary"
        return "destructive"
      }

    console.log(question_number);
    console.log(num_questions);

    return (
        
        <div className="space-y-6">
              {/* Response Display */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Your Response</CardTitle>
                    <Badge variant={getScoreBadgeVariant(score)} className="text-lg px-3 py-1">
                      {score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 leading-relaxed">{userResponse}</p>
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
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{feedback}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">8.5/10</div>
                        <div className="text-sm text-gray-600">Content Quality</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">9/10</div>
                        <div className="text-sm text-gray-600">Clarity</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">7/10</div>
                        <div className="text-sm text-gray-600">Completeness</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
            </div>

    );
}