"use client";
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-blue-950 mb-6">
            Master Your Next Interview
            <span className="block text-3xl sm:text-5xl mt-2 text-slate-700">
              with AI-Powered Practice
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Practice interviews with personalized AI-generated questions, 
            get instant feedback, and track your progress to land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-4 text-lg font-medium transition-all duration-200 hover:scale-105">
                Start Practice Interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-medium transition-all duration-200" onClick={scrollToHowItWorks}>
              <Play className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
          </div>
        </div>
        
        {/* Visual element with screenshot */}
        <div className="mt-16 relative mx-auto max-w-5xl">
          <div className="absolute inset-0 bg-blue-950/10 rounded-3xl blur-3xl -z-10 transform translate-y-8 scale-95"></div>
          <div className="bg-white border border-slate-200 rounded-3xl p-2 sm:p-4 shadow-2xl overflow-hidden ring-1 ring-slate-100">
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group">
              <Image 
                src="/record.png" 
                alt="AI Interview Recording Interface" 
                width={1200} 
                height={675} 
                className="w-full h-auto object-cover rounded-xl shadow-inner transition-transform duration-700 group-hover:scale-[1.01]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
          
          {/* Overlay badges */}
          <div className="absolute -bottom-6 -right-6 hidden lg:block">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Play className="h-5 w-5 text-green-600 fill-current" />
                </div>
                <p className="font-semibold text-blue-950 text-sm">Live Feedback</p>
              </div>
              <p className="text-xs text-slate-500">Real-time analysis of your communication skills</p>
            </div>
          </div>
          
          <div className="absolute -top-6 -left-6 hidden lg:block">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
                <p className="font-semibold text-blue-950 text-sm">Personalized</p>
              </div>
              <p className="text-xs text-slate-500">Tailored to your target role and industry</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
