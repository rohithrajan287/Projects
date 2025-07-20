"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, MessageCircle } from "lucide-react"

type AppState = "initial" | "uploading" | "uploaded" | "questioning" | "answered"

export default function ResumeQABot() {
  const [state, setState] = useState<AppState>("initial")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleUploadClick = () => {
    setShowUploadModal(true)
  }

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
	  const file = event.target.files?.[0]
	  if (file) {
		setUploadedFile(file)
		setState("uploading")
		setShowUploadModal(false)

		const formData = new FormData()
		formData.append("file", file)

		try {
		  const res = await fetch("http://localhost:8081/upload", {
			method: "POST",
			body: formData,
		  })

		  const data = await res.json()
		  console.log("Upload response:", data)
		  setState("uploaded")
		} catch (err) {
		  console.error("Upload failed", err)
		  alert("Upload failed")
		  setState("initial")
		}
	  }
	}


  const handleFigureClick = () => {
    if (state === "uploaded" || state === "answered") {
      setShowQuestionModal(true)
    }
  }

	const handleQuestionSubmit = async () => {
	  if (question.trim()) {
		setState("questioning")
		setShowQuestionModal(false)

		try {
		  const res = await fetch("http://localhost:8081/ask", {
			method: "POST",
			headers: {
			  "Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({ question }),
		  })

		  const data = await res.json()
		  setAnswer(data.answer)
		} catch (err) {
		  console.error("Error:", err)
		  setAnswer("Failed to get answer from backend.")
		}

		setState("answered")
	  }
	}


  return (
    <div className="min-h-screen bg-[#0B0F17] relative overflow-hidden font-['Inter',sans-serif]">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1a2332] via-[#0B0F17] to-[#0B0F17]" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* 3D Human Figure */}
        <div
          className={`relative mb-8 transition-all duration-500 ${
            state === "uploaded" || state === "answered" ? "cursor-pointer hover:scale-105" : ""
          }`}
          onClick={handleFigureClick}
        >
          <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-2xl shadow-cyan-500/20">
            <img
              src="/images/avatar.png" // ✅ YOUR image in /public/images/
              alt="AI Assistant"
              className="w-full h-full rounded-full object-cover bg-gray-800"
            />
          </div>

          {/* Typing animation during upload */}
          {state === "uploading" && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1 bg-gray-800 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Question processing animation */}
          {state === "questioning" && (
            <div className="absolute -top-4 -right-4">
              <MessageCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        {state === "initial" && (
          <Button
            onClick={handleUploadClick}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105 animate-pulse"
          >
            Click on me to upload your resume
          </Button>
        )}

        {/* Success Message */}
        {state === "uploaded" && (
          <div className="text-[#00FF9C] font-bold text-lg text-center animate-fade-in">
            Resume uploaded! Ask your question now.
            <div className="text-sm text-gray-400 mt-2">Click on the figure above to ask a question</div>
          </div>
        )}

        {/* Answer Bubble */}
        {state === "answered" && answer && (
          <div className="mt-8 max-w-md animate-fade-in">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 shadow-xl border border-gray-600 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-800 rotate-45 border-l border-t border-gray-600" />
              <p className="text-white text-sm leading-relaxed">{answer}</p>
              <Button
                onClick={() => setShowQuestionModal(true)}
                className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Ask Another Question
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-cyan-400">Upload Your Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">Choose your resume file</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors inline-block"
              >
                Browse Files
              </label>
            </div>
            <p className="text-xs text-gray-400 text-center">Supported formats: PDF, DOC, DOCX</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Modal */}
      <Dialog open={showQuestionModal} onOpenChange={setShowQuestionModal}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-cyan-400">Ask Your Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to know about your resume?"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500"
                onKeyPress={(e) => e.key === "Enter" && handleQuestionSubmit()}
              />
            </div>
            <Button
              onClick={handleQuestionSubmit}
              disabled={!question.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Submit Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
