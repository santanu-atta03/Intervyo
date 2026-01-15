import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Briefcase,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";
import { createInterview } from "../../services/operations/aiInterviewApi";
import { useSelector } from "react-redux";

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    role: "",
    difficulty: "medium",
    duration: 30,
    scheduledAt: new Date().toISOString().slice(0, 16),
  });
  const { token } = useSelector((state) => state.auth);
  const difficultyLevels = [
    {
      value: "easy",
      label: "Easy",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      value: "medium",
      label: "Medium",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      value: "hard",
      label: "Hard",
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ];

  const durationOptions = [15, 30, 45, 60, 90];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role.trim()) {
      alert("Please enter the role");
      return;
    }

    if (!resumeFile) {
      alert("Please upload your resume");
      return;
    }

    const data = new FormData();
    data.append("role", formData.role);
    data.append("difficulty", formData.difficulty);
    data.append("duration", formData.duration);
    data.append("scheduledAt", formData.scheduledAt);
    data.append("resume", resumeFile);

    try {
      const interview = await createInterview(data, setLoading, token);
      navigate(`/interview/${interview._id}`);
    } catch (error) {
      console.error("Setup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                AI Interview Platform
              </h1>
              <p className="text-sm text-gray-400">Setup Your Interview</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Schedule Your AI Interview
          </h2>
          <p className="text-lg text-gray-400">
            Configure your interview settings and get ready for an immersive
            experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <label className="block text-white font-semibold mb-2">
                  Job Role / Position
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer, Data Scientist"
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <p className="text-sm text-gray-400 mt-2">
                  Enter the position you're interviewing for
                </p>
              </div>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <label className="block text-white font-semibold mb-4">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, difficulty: level.value })
                      }
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.difficulty === level.value
                          ? `${level.bg} border-${level.color.split("-")[1]}-400`
                          : "bg-gray-900/30 border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      <div className={`text-lg font-bold ${level.color}`}>
                        {level.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {level.value === "easy" && "5-7 questions"}
                        {level.value === "medium" && "7-10 questions"}
                        {level.value === "hard" && "10-12 questions"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <label className="block text-white font-semibold mb-4">
                  Duration (minutes)
                </label>
                <div className="flex flex-wrap gap-3">
                  {durationOptions.map((duration) => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => setFormData({ ...formData, duration })}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        formData.duration === duration
                          ? "bg-purple-500 text-white"
                          : "bg-gray-900/50 text-gray-300 border border-gray-600 hover:border-purple-500"
                      }`}
                    >
                      {duration} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Time */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <label className="block text-white font-semibold mb-2">
                  Schedule Time
                </label>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <label className="block text-white font-semibold mb-4">
                  Upload Resume
                </label>
                {!resumeFile ? (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors">
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-400">
                        PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                ) : (
                  <div className="bg-gray-900/50 border border-gray-600 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-white font-medium">
                          {resumeFile.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                Start Interview
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewSetup;
