"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function InterviewQuestion({ interview, question, question_number }) {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    
    return (
        <div className="container h-screen w-screen mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
            <Card className={`mb-8 bg-neutral-800 border border-neutral-600 transition-all duration-500 ease-out ${
            isAnimating 
              ? 'opacity-0 transform translate-y-8 scale-95' 
              : 'opacity-100 transform translate-y-0 scale-100'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xl transition-all text-gray-100 duration-700 delay-200 ${
                  isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
                }`}>
                  Question {question_number}
                </CardTitle>
                <Badge variant="outline" className={`bg-neutral-700 flex items-center space-x-1 transition-all duration-700 delay-300 text-gray-100 ${
                  isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
                }`}>
                  <Clock className="h-4 w-4" />
                  <span>2:00</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-lg text-gray-100 leading-relaxed transition-all duration-700 delay-400 ${
                isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
              }`}>
                {question}
              </p>
            </CardContent>
          </Card>
            </div>
            
        </div>
    );
}