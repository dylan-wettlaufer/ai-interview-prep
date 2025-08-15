"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
    ArrowLeft,
    Code,
    Palette,
    TrendingUp,
    Shield,
    Smartphone,
    Globe,
    Brain,
    MessageSquare,
    Target,
    Zap,
    Star,
    Clock,
    Play,
  } from "lucide-react"

import LoadingScreen from "./LoadingScreen"

const popularJobTitles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UX/UI Designer",
    "DevOps Engineer",
    "Mobile Developer",
    "Machine Learning Engineer",
    "System Administrator",
    "Cybersecurity Analyst",
  ]

const interviewCategories = [
    {
      id: "software-engineering",
      title: "Software Engineering",
      description: "Technical coding questions, algorithms, and system design",
      icon: Code,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      id: "data-science",
      title: "Data Science",
      description: "Statistics, machine learning, and data analysis questions",
      icon: TrendingUp,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      id: "product-management",
      title: "Product Management",
      description: "Strategy, prioritization, and product thinking scenarios",
      icon: Target,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      id: "design",
      title: "UX/UI Design",
      description: "Design thinking, user research, and portfolio reviews",
      icon: Palette,
      color: "bg-pink-50 border-pink-200",
      iconColor: "text-pink-600",
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Growth strategies, campaigns, and market analysis",
      icon: TrendingUp,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      description: "Security protocols, threat analysis, and risk management",
      icon: Shield,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
    },
    {
      id: "mobile-development",
      title: "Mobile Development",
      description: "iOS, Android, and cross-platform development questions",
      icon: Smartphone,
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600",
    },
    {
      id: "web-development",
      title: "Web Development",
      description: "Frontend, backend, and full-stack web technologies",
      icon: Globe,
      color: "bg-teal-50 border-teal-200",
      iconColor: "text-teal-600",
    },
  ]

  
const focusAreas = [
    { value: "technical", label: "Technical Skills" },
    { value: "behavioral", label: "Behavioral Questions" },
    { value: "system-design", label: "System Design" },
    { value: "problem-solving", label: "Problem Solving" },
    { value: "leadership", label: "Leadership" },
    { value: "communication", label: "Communication" },
    { value: "mixed", label: "Mixed (All Areas)" },
  ]
  
const difficultyLevels = [
    { value: "entry", label: "Entry Level", description: "0-2 years experience" },
    { value: "mid", label: "Mid Level", description: "2-5 years experience" },
    { value: "senior", label: "Senior Level", description: "5+ years experience" },
    { value: "lead", label: "Lead/Principal", description: "Leadership roles" },
  ]

export default function CreateInterview() {
    const [selectedTab, setSelectedTab] = useState("custom")
    const [jobTitle, setJobTitle] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [focusArea, setFocusArea] = useState("")
    const [difficulty, setDifficulty] = useState("")
    const [loading, setLoading] = useState(false)

    const handlePopularJobSelect = (title) => {
        setJobTitle(title)
      }
    
      const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId)
      }
    
      const canCreateInterview = () => {
        if (selectedTab === "custom") {
          return jobTitle && focusArea && difficulty
        } else {
          return selectedCategory && focusArea && difficulty
        }
      }

    const handleCreateInterview = async () => {
        setLoading(true)

        if((!jobTitle || !selectedCategory) || !focusArea || !difficulty) {
            return
        }

        try {
            const response = await fetch('http://localhost:8000/gen-ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    jobTitle: selectedTab === "custom" ? jobTitle : selectedCategory,
                    jobDescription: jobDescription,
                    interviewType: focusArea,
                    difficultyLevel: difficulty,
                    interviewSource: selectedTab === "custom" ? "AI" : "Category"
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate questions');
            }

            const data = await response.json();
            console.log(data);
            router.push(`/interview/${data.interview_id}`);
        } catch (error) {
            console.error('Error generating questions:', error);
            setLoading(false)
        }
        
    }

    return (
        <>
        {loading && <LoadingScreen message="Generating questions..." />}
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="custom" className="flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span>Custom Interview Details</span>
                    </TabsTrigger>
                    <TabsTrigger value="browse" className="flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Browse Categories</span>
                    </TabsTrigger>
                    </TabsList>

                    {/* Custom Interview Details Tab */}
                    <TabsContent value="custom" className="space-y-8">
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Job Details
                        </CardTitle>
                        <p className="text-sm text-gray-500">Enter custom job details to get started</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        {/* Job Title Input */}
                        <div className="space-y-2">
                            <Label htmlFor="job-title">Job Title *</Label>
                            <Input
                            id="job-title"
                            placeholder="e.g., Senior Software Engineer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="text-base"
                            />
                        </div>

                        {/* Popular Job Titles */}
                        <div className="space-y-3">
                            <Label>Popular Job Titles</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {popularJobTitles.map((title) => (
                                <Button
                                key={title}
                                variant={jobTitle === title ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePopularJobSelect(title)}
                                className="text-xs h-8 bg-transparent"
                                >
                                {title}
                                </Button>
                            ))}
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-2">
                            <Label htmlFor="job-description">Job Description (Optional)</Label>
                            <Textarea
                            id="job-description"
                            placeholder="Paste the job description here or describe the role, responsibilities, and requirements..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="min-h-[120px] text-sm"
                            />
                            <p className="text-xs text-gray-500">
                            Adding a job description helps generate more relevant interview questions
                            </p>
                        </div>
                        </CardContent>
                    </Card>
                    </TabsContent>

                    {/* Browse Categories Tab */}
                    <TabsContent value="browse" className="space-y-8">
                    <Card>
                        <CardHeader>
                        <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2" />
                            Interview Categories
                        </CardTitle>
                        <p className="text-sm text-gray-500">Select a category to get started</p>
                        </CardHeader>
                        <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {interviewCategories.map((category) => (
                            <Card
                                key={category.id}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-102 ${
                                selectedCategory === category.id ? "ring-2 ring-neutral-400 " + category.color : category.color
                                }`}
                                onClick={() => handleCategorySelect(category.title)}
                            >
                                <CardContent className="">
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded-lg ${category.color}`}>
                                    <category.icon className={`h-5 w-5 ${category.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                                    <p className="text-sm text-gray-600 ">{category.description}</p>
                                    
                                    </div>
                                </div>
                                </CardContent>
                            </Card>
                            ))}
                        </div>
                        </CardContent>
                    </Card>
                    </TabsContent>
                </Tabs>

                {/* Interview Configuration */}
                <Card className="mt-8">
                    <CardHeader>
                    <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Interview Configuration
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Focus Area */}
                        <div className="space-y-2">
                        <Label>Focus Area *</Label>
                        <Select value={focusArea} onValueChange={setFocusArea}>
                            <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select focus area" />
                            </SelectTrigger>
                            <SelectContent>
                            {focusAreas.map((area) => (
                                <SelectItem key={area.value} value={area.value}>
                                {area.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>

                        {/* Difficulty Level */}
                        <div className="space-y-2">
                        <Label>Difficulty Level *</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                            {difficultyLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value} className="py-2 px-4">
                                <div className="flex flex-col">
                                    <span>{level.label}</span>
                                    <span className="text-xs text-gray-500">{level.description}</span>
                                </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                    </CardContent>
                </Card>

                {/* Interview Preview */}
                {canCreateInterview() && (
                    <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="">
                        <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Interview Preview</h3>
                            <div className="space-y-1 text-sm text-blue-700">
                            {selectedTab === "custom" ? (
                                <p>
                                <strong>Position:</strong> {jobTitle}
                                </p>
                            ) : (
                                <p>
                                <strong>Category:</strong>{" "}
                                {selectedCategory}
                                </p>
                            )}
                            <p>
                                <strong>Focus:</strong> {focusAreas.find((area) => area.value === focusArea)?.label}
                            </p>
                            <p>
                                <strong>Level:</strong> {difficultyLevels.find((level) => level.value === difficulty)?.label}
                            </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-blue-700">~5-10 minutes</span>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                        Cancel
                    </Button>
                    </Link>
                    <Link href="/interview/welcome" className="flex-2">
                    <Button className="w-full" onClick={() => handleCreateInterview()} disabled={!canCreateInterview()}>
                        <Play className="h-4 w-4 mr-2" />
                        Create Interview
                    </Button>
                    </Link>
                </div>
                </div>
            </div>
        </div>
        </>
        
    )
  }


