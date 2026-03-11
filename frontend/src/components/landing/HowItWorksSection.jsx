"use client";
import { UserCheck, MessageSquare, FileText } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    icon: UserCheck,
    title: "1. Create Interview",
    description: "Enter your target job title and description. AI will generate tailored questions just for you.",
    image: "/create.png"
  },
  {
    icon: MessageSquare,
    title: "2. Practice & Record",
    description: "Respond to each question naturally. Our system transcribes and analyzes your communication style.",
    image: "/record.png"
  },
  {
    icon: FileText,
    title: "3. Detailed Feedback",
    description: "Receive instant, actionable feedback on content, clarity, and completeness with improvement tips.",
    image: "/review.png"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-950 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started with interview practice in three simple steps
          </p>
        </div>
        
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Text content */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-950 text-white font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <h3 className="text-3xl font-bold text-blue-950">
                  {step.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  {step.description}
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-blue-950" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">Expert-level AI analysis included</span>
                </div>
              </div>
              
              {/* Image content */}
              <div className="flex-1 w-full max-w-2xl">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-950/5 rounded-2xl blur-2xl transform group-hover:scale-105 transition-transform duration-500"></div>
                  <div className="relative bg-white border border-slate-200 rounded-2xl p-2 shadow-xl overflow-hidden ring-1 ring-slate-100">
                    <div className="rounded-xl overflow-hidden border border-slate-100">
                      <Image 
                        src={step.image} 
                        alt={step.title} 
                        width={800} 
                        height={450} 
                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional info */}
        <div className="mt-24 text-center">
          <div className="bg-blue-950 text-white rounded-3xl p-10 sm:p-16 max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/30 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                Ready to Start Practicing?
              </h3>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of job seekers who are improving their interview skills with AI-powered practice. Land your next role with confidence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Free to start</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
