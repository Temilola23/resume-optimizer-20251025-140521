"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Sparkles, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function ResumeOptimizer() {
  const [file, setFile] = useState<File | null>(null)
  const [originalContent, setOriginalContent] = useState<string>("")
  const [optimizedContent, setOptimizedContent] = useState<string>("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile) return

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/x-tex",
      "text/x-tex",
    ]

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith(".tex")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, TXT, or LaTeX file.",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)

    // Read file content
    const text = await selectedFile.text()
    setOriginalContent(text)
    setOptimizedContent("")

    toast({
      title: "File uploaded",
      description: `${selectedFile.name} is ready to be optimized.`,
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFileChange(droppedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const optimizeResume = async () => {
    if (!originalContent) {
      toast({
        title: "No resume uploaded",
        description: "Please upload a resume first.",
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: originalContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to optimize resume")
      }

      const data = await response.json()
      setOptimizedContent(data.optimizedContent)

      toast({
        title: "Resume optimized!",
        description: "Your resume has been improved with AI suggestions.",
      })
    } catch (error) {
      console.error("[v0] Error optimizing resume:", error)
      toast({
        title: "Optimization failed",
        description: "There was an error optimizing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const downloadOptimized = () => {
    if (!optimizedContent) return

    const blob = new Blob([optimizedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `optimized-${file?.name || "resume.txt"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Your optimized resume is being downloaded.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Resume Optimizer</h1>
                <p className="text-sm text-muted-foreground">AI-powered resume enhancement</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Upload Section */}
        {!file && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="mb-3 text-4xl font-bold text-balance text-foreground">Transform Your Resume with AI</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Upload your resume and let our AI analyze and improve it with professional suggestions
              </p>
            </div>

            <Card
              className={`border-2 border-dashed transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Upload your resume</h3>
                <p className="mb-6 text-sm text-muted-foreground">Supports PDF, DOCX, TXT, and LaTeX formats</p>
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>
                      <FileText className="mr-2 h-4 w-4" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt,.tex"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </div>
            </Card>

            {/* Features */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">AI-Powered Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced AI reviews your resume and suggests improvements
                </p>
              </Card>
              <Card className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">Multiple Formats</h3>
                <p className="text-sm text-muted-foreground">Support for PDF, DOCX, TXT, and even LaTeX documents</p>
              </Card>
              <Card className="p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Download className="h-5 w-5 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-card-foreground">Easy Export</h3>
                <p className="text-sm text-muted-foreground">Download your optimized resume in your preferred format</p>
              </Card>
            </div>
          </div>
        )}

        {/* Comparison View */}
        {file && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Resume Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  File: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setOriginalContent("")
                    setOptimizedContent("")
                  }}
                >
                  Upload New
                </Button>
                {!optimizedContent && (
                  <Button onClick={optimizeResume} disabled={isOptimizing}>
                    {isOptimizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Optimize Resume
                      </>
                    )}
                  </Button>
                )}
                {optimizedContent && (
                  <Button onClick={downloadOptimized}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="comparison">Side by Side</TabsTrigger>
                <TabsTrigger value="optimized">Optimized Only</TabsTrigger>
              </TabsList>

              <TabsContent value="comparison" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="flex flex-col">
                    <div className="border-b border-border bg-muted/50 px-6 py-4">
                      <h3 className="font-semibold text-card-foreground">Original Resume</h3>
                    </div>
                    <div className="flex-1 overflow-auto p-6">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-card-foreground">
                        {originalContent || "No content available"}
                      </pre>
                    </div>
                  </Card>

                  <Card className="flex flex-col">
                    <div className="border-b border-border bg-accent/10 px-6 py-4">
                      <h3 className="font-semibold text-card-foreground">Optimized Resume</h3>
                    </div>
                    <div className="flex-1 overflow-auto p-6">
                      {isOptimizing ? (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Analyzing and optimizing your resume...</p>
                          </div>
                        </div>
                      ) : optimizedContent ? (
                        <pre className="whitespace-pre-wrap font-mono text-sm text-card-foreground">
                          {optimizedContent}
                        </pre>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <Sparkles className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click "Optimize Resume" to get started</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="optimized" className="mt-6">
                <Card className="flex flex-col">
                  <div className="border-b border-border bg-accent/10 px-6 py-4">
                    <h3 className="font-semibold text-card-foreground">Optimized Resume</h3>
                  </div>
                  <div className="min-h-[600px] overflow-auto p-6">
                    {isOptimizing ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Analyzing and optimizing your resume...</p>
                        </div>
                      </div>
                    ) : optimizedContent ? (
                      <pre className="whitespace-pre-wrap font-mono text-sm text-card-foreground">
                        {optimizedContent}
                      </pre>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <Sparkles className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click "Optimize Resume" to get started</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}
