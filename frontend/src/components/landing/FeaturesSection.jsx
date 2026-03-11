"use client";
import { Brain, TrendingUp, Mic, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: "Smart Questions, Tailored to You",
    description: "AI generates relevant interview questions based on your role and experience level",
    color: "bg-blue-50 text-blue-950"
  },
  {
    icon: TrendingUp,
    title: "Instant, Actionable Feedback",
    description: "Get structured feedback on your responses to improve quickly and effectively",
    color: "bg-green-50 text-green-950"
  },
  {
    icon: Mic,
    title: "Practice Speaking Naturally",
    description: "Record your responses and get transcribed for detailed analysis and improvement",
    color: "bg-purple-50 text-purple-950"
  },
  {
    icon: BarChart3,
    title: "Track Your Improvement",
    description: "Monitor your progress across multiple interview sessions and see your growth",
    color: "bg-orange-50 text-orange-950"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive tools to help you master your interview skills
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow duration-300 bg-white">
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-blue-950 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Visual representation */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-950 mb-2">
              See Your Progress in Real-Time
            </h3>
            <p className="text-slate-600">
              Track your interview performance and improvement over time
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
              <div className="text-3xl font-bold text-blue-950 mb-1">85%</div>
              <div className="text-sm text-slate-600">Average Score</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
              <div className="text-3xl font-bold text-green-950 mb-1">+42%</div>
              <div className="text-sm text-slate-600">Improvement Rate</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
              <div className="text-3xl font-bold text-purple-950 mb-1">12</div>
              <div className="text-sm text-slate-600">Practice Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
