"use client";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Start practicing today with personalized AI-generated questions and get the feedback you need to succeed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-950 hover:bg-blue-50 px-8 py-4 text-lg font-medium transition-all duration-200 hover:scale-105">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-950 px-8 py-4 text-lg font-medium transition-all duration-200">
            Learn More
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
