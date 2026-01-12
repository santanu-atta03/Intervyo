import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  BarChart3,
  Bookmark,
  Share2,
  Download,
  BookOpen,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { customToast } from "../../utils/toast";

const API_BASE_URL = "https://intervyo.onrender.com/api";

// ModuleContent component to render formatted content
// function ModuleContent({ content }) {
//   const renderContent = () => {
//     if (!content) return <p className="text-gray-400">No content available</p>;

//     const paragraphs = content.split('\n\n').filter(p => p.trim());

//     return paragraphs.map((para, idx) => {
//       if (para.startsWith('# ')) {
//         return <h1 key={idx} className="text-3xl font-bold mb-4">{para.slice(2)}</h1>;
//       }
//       if (para.startsWith('## ')) {
//         return <h2 key={idx} className="text-2xl font-bold mb-3 mt-6">{para.slice(3)}</h2>;
//       }
//       if (para.startsWith('### ')) {
//         return <h3 key={idx} className="text-xl font-bold mb-2 mt-4">{para.slice(4)}</h3>;
//       }

//       if (para.includes('\n- ') || para.startsWith('- ')) {
//         const items = para.split('\n').filter(item => item.trim().startsWith('- '));
//         return (
//           <ul key={idx} className="list-disc list-inside space-y-2 mb-4">
//             {items.map((item, i) => (
//               <li key={i} className="text-gray-300">{item.slice(2)}</li>
//             ))}
//           </ul>
//         );
//       }

//       return <p key={idx} className="text-gray-300 mb-4 leading-relaxed">{para}</p>;
//     });
//   };

//   return <div>{renderContent()}</div>;
// }

// export function ModuleContentPage({
//   moduleId,
//   topicId,
//   onBack,
//   onNextModule,
//   onPrevModule,
// }) {
//   const { token } = useSelector((state) => state.auth);
//   const [module, setModule] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showNotes, setShowNotes] = useState(false);
//   const [note, setNote] = useState("");
//   const [completing, setCompleting] = useState(false);
//   const [startTime] = useState(Date.now());

//   useEffect(() => {
//     fetchModuleData();
//   }, [moduleId]);

//   const fetchModuleData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/learning-hub/modules/${moduleId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch module");
//       }

//       const data = await response.json();
//       setModule(data.data);
//     } catch (err) {
//       console.error("Error fetching module:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleComplete = async () => {
//     setCompleting(true);
//     const timeSpent = Math.floor((Date.now() - startTime) / 60000); // minutes

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/learning-hub/modules/${moduleId}/complete`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ timeSpent: Math.max(timeSpent, 1) }),
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         alert(`✅ ${data.message}\n🎉 You earned ${data.data.xpAwarded} XP!`);
//         await fetchModuleData();
//       } else {
//         const error = await response.json();
//         alert(error.message || "Failed to mark complete");
//       }
//     } catch (err) {
//       console.error("Error marking complete:", err);
//       alert("Failed to mark complete. Please try again.");
//     } finally {
//       setCompleting(false);
//     }
//   };

//   const handleSaveNote = async () => {
//     if (!note.trim()) return;

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/learning-hub/modules/${moduleId}/notes`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ content: note }),
//         }
//       );

//       if (response.ok) {
//         alert("✅ Note saved successfully!");
//         setNote("");
//         setShowNotes(false);
//       }
//     } catch (err) {
//       console.error("Error saving note:", err);
//       alert("Failed to save note");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-400">
//             🤖 AI is generating your module content...
//           </p>
//           <p className="text-gray-500 text-sm mt-2">
//             This may take a few moments
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !module) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
//           <p className="text-gray-400 mb-6">{error || "Module not found"}</p>
//           <button
//             onClick={onBack}
//             className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const content = module.content?.content || module.content || "";
//   const isCompleted = module.isCompleted || false;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       {/* Fixed Header */}
//       <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={onBack}
//                 className="text-gray-400 hover:text-white transition"
//               >
//                 <ArrowLeft className="w-6 h-6" />
//               </button>
//               <div>
//                 <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
//                   <span>{module.topicId?.icon || "📚"}</span>
//                   <span>{module.topicId?.title || "Course"}</span>
//                 </div>
//                 <h1 className="text-xl font-bold text-white">{module.title}</h1>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setShowNotes(!showNotes)}
//                 className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition flex items-center gap-2"
//               >
//                 <MessageSquare className="w-5 h-5" />
//                 Notes
//               </button>
//               {!isCompleted && (
//                 <button
//                   onClick={handleComplete}
//                   disabled={completing}
//                   className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
//                 >
//                   <CheckCircle className="w-5 h-5" />
//                   {completing ? "Saving..." : "Mark Complete"}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
//               {/* Module Info */}
//               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700/50">
//                 <div className="flex items-center gap-2 text-sm text-gray-400">
//                   <Clock className="w-4 h-4" />
//                   <span>{module.estimatedMinutes} min read</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-400">
//                   <Eye className="w-4 h-4" />
//                   <span>Interactive</span>
//                 </div>
//                 {isCompleted && (
//                   <div className="flex items-center gap-2 text-sm text-emerald-400">
//                     <CheckCircle className="w-4 h-4" />
//                     <span>Completed</span>
//                   </div>
//                 )}
//               </div>

//               {/* Content */}
//               <div className="prose prose-invert prose-lg max-w-none">
//                 <ModuleContent content={content} />
//               </div>

//               {/* Navigation */}
//               <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-700/50">
//                 {module.prevModule ? (
//                   <button
//                     onClick={() => onPrevModule(module.prevModule._id)}
//                     className="flex items-center gap-2 text-gray-400 hover:text-white transition"
//                   >
//                     <ArrowLeft className="w-5 h-5" />
//                     <div className="text-left">
//                       <div className="text-xs">Previous</div>
//                       <div className="font-semibold">
//                         {module.prevModule.title}
//                       </div>
//                     </div>
//                   </button>
//                 ) : (
//                   <div></div>
//                 )}

//                 {module.nextModule && (
//                   <button
//                     onClick={() => onNextModule(module.nextModule._id)}
//                     className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
//                   >
//                     <div className="text-right">
//                       <div className="text-xs opacity-90">Next</div>
//                       <div className="font-semibold">
//                         {module.nextModule.title}
//                       </div>
//                     </div>
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Completion Card */}
//             {isCompleted && (
//               <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-6 mt-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
//                     <CheckCircle className="w-7 h-7 text-emerald-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-white mb-1">
//                       Module Completed! 🎉
//                     </h3>
//                     <p className="text-gray-300">
//                       Great job! Keep up the momentum.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Notes Panel */}
//             {showNotes && (
//               <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mt-6">
//                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                   <MessageSquare className="w-5 h-5 text-purple-400" />
//                   Your Notes
//                 </h3>
//                 <textarea
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                   placeholder="Write your notes here..."
//                   className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//                 <div className="flex gap-3 mt-4">
//                   <button
//                     onClick={handleSaveNote}
//                     className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
//                   >
//                     Save Note
//                   </button>
//                   <button
//                     onClick={() => setShowNotes(false)}
//                     className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Progress */}
//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                 <BarChart3 className="w-5 h-5 text-purple-400" />
//                 Your Progress
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <div className="text-2xl font-bold text-white">Learning</div>
//                   <div className="text-xs text-gray-400">Keep going!</div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//               <h3 className="text-lg font-bold text-white mb-4">
//                 Quick Actions
//               </h3>
//               <div className="space-y-2">
//                 <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
//                   <Bookmark className="w-4 h-4" />
//                   Bookmark
//                 </button>
//                 <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
//                   <Share2 className="w-4 h-4" />
//                   Share
//                 </button>
//                 <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
//                   <Download className="w-4 h-4" />
//                   Download
//                 </button>
//               </div>
//             </div>

//             {/* Resources */}
//             <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
//               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                 <BookOpen className="w-5 h-5 text-purple-400" />
//                 Resources
//               </h3>
//               <p className="text-sm text-gray-400">
//                 Additional learning materials and resources will appear here.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

function ModuleContent({ content }) {
  const renderContent = () => {
    if (!content) return <p className="text-gray-400">No content available</p>;

    const paragraphs = content.split("\n\n").filter((p) => p.trim());

    return paragraphs.map((para, idx) => {
      if (para.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-3xl font-bold mb-4">
            {para.slice(2)}
          </h1>
        );
      }
      if (para.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-2xl font-bold mb-3 mt-6">
            {para.slice(3)}
          </h2>
        );
      }
      if (para.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xl font-bold mb-2 mt-4">
            {para.slice(4)}
          </h3>
        );
      }

      if (para.includes("\n- ") || para.startsWith("- ")) {
        const items = para
          .split("\n")
          .filter((item) => item.trim().startsWith("- "));
        return (
          <ul key={idx} className="list-disc list-inside space-y-2 mb-4">
            {items.map((item, i) => (
              <li key={i} className="text-gray-300">
                {item.slice(2)}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-gray-300 mb-4 leading-relaxed">
          {para}
        </p>
      );
    });
  };

  return <div>{renderContent()}</div>;
}

// Module Content Page Component
function ModuleContentPage({ moduleId, onBack, onNextModule, onPrevModule }) {
  const {token} = useSelector((state) => state.auth)
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [note, setNote] = useState("");
  const [completing, setCompleting] = useState(false);
  const [startTime] = useState(Date.now());

  React.useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/learning-hub/modules/${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch module");
      }

      const data = await response.json();
      console.log("Module data : ",data);
      setModule(data.data);
    } catch (err) {
      console.error("Error fetching module:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 60000);

    try {
      const response = await fetch(
        `${API_BASE_URL}/learning-hub/modules/${moduleId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timeSpent: Math.max(timeSpent, 1) }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        customToast.success(data.message);
        customToast.success(`You earned ${data.data.xpAwarded} XP!`);
        await fetchModuleData();
      } else {
        const error = await response.json();
        customToast.error(error.message || "Failed to mark complete!");
      }
    } catch (err) {
      console.error("Error marking complete:", err);
      customToast.error("Failed to mark complete. Please try again.")
    } finally {
      setCompleting(false);
    }
  };

  const handleSaveNote = async () => {
    if (!note.trim()) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/learning-hub/modules/${moduleId}/notes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: note }),
        }
      );

      if (response.ok) {
        customToast.success("Note saved sucessfully");
        setNote("");
        setShowNotes(false);
      }
    } catch (err) {
      customToast.error("Error saving note");
    }
  };


  const handleShareCourse = async (topic) => {
  const shareData = {
    title: topic.title,
    text: `Check out this course: ${topic.title} - ${topic.description}`,
    url: `${window.location.origin}/learning-hub/topics/${topic._id}`
  };

  try {
    // Check if Web Share API is supported
    if (navigator.share) {
      await navigator.share(shareData);
      customToast.success('Course shared successfully!');
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareData.url);
      customToast.success('Course link copied to clipboard!');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
      customToast.error('Failed to share course');
    }
  }
};

  const handleDownloadResources = async (topic, modules, token) => {
  try {
    customToast.info('Preparing resources for download...');

    // Create markdown content with all modules
    let markdownContent = `# ${topic.title}\n\n`;
    markdownContent += `**Description:** ${topic.description}\n\n`;
    markdownContent += `**Domain:** ${topic.domain}\n`;
    markdownContent += `**Difficulty:** ${topic.difficulty}\n`;
    markdownContent += `**Estimated Hours:** ${topic.estimatedHours}h\n\n`;
    
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      markdownContent += `## Prerequisites\n`;
      topic.prerequisites.forEach(prereq => {
        markdownContent += `- ${prereq}\n`;
      });
      markdownContent += '\n';
    }

    markdownContent += `---\n\n`;
    markdownContent += `## Course Modules\n\n`;

    // Fetch and add each module's content
    for (const module of modules) {
      markdownContent += `### ${module.title}\n\n`;
      markdownContent += `**Duration:** ${module.estimatedMinutes} minutes\n`;
      markdownContent += `**Type:** ${module.contentType}\n\n`;
      
      try {
        // Fetch module content
        const response = await fetch(
          `https://intervyo.onrender.com/api/learning-hub/modules/${module._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const content = data.data.content;
          
          if (typeof content === 'object' && content.content) {
            markdownContent += content.content + '\n\n';
          } else if (typeof content === 'string') {
            markdownContent += content + '\n\n';
          }
        }
      } catch (err) {
        console.error(`Error fetching module ${module.title}:`, err);
        markdownContent += `_Content not available_\n\n`;
      }

      markdownContent += `---\n\n`;
    }

    // Add footer
    markdownContent += `\n\n---\n`;
    markdownContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
    markdownContent += `Course URL: ${window.location.origin}/learning-hub/topics/${topic._id}\n`;

    // Create blob and download
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.title.replace(/[^a-z0-9]/gi, '_')}_course_notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    customToast.success('Resources downloaded successfully!');
  } catch (error) {
    console.error('Error downloading resources:', error);
    customToast.error('Failed to download resources');
  }
};

const handleDownloadModule = (module, content) => {
  try {
    let markdownContent = `# ${module.title}\n\n`;
    markdownContent += `**Duration:** ${module.estimatedMinutes} minutes\n`;
    markdownContent += `**Type:** ${module.contentType}\n\n`;
    markdownContent += `---\n\n`;

    if (typeof content === 'object' && content.content) {
      markdownContent += content.content;
    } else if (typeof content === 'string') {
      markdownContent += content;
    }

    markdownContent += `\n\n---\n`;
    markdownContent += `Downloaded on: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${module.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    customToast.success('Module downloaded successfully!');
  } catch (error) {
    console.error('Error downloading module:', error);
    customToast.error('Failed to download module');
  }
};

 const handleShareModule = async (module, topicId) => {
  const shareData = {
    title: module.title,
    text: `Check out this module: ${module.title}`,
    url: `${window.location.origin}/learning-hub/topics/${topicId}/modules/${module._id}`
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      customToast.success('Module shared successfully!');
    } else {
      await navigator.clipboard.writeText(shareData.url);
      customToast.success('Module link copied to clipboard!');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error);
      customToast.error('Failed to share module');
    }
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">🤖 Loading module content...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error || "Module not found"}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const content = module.content?.content || module.content || "";
  const isCompleted = module.isCompleted || false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <span>{module.topicId?.icon || "📚"}</span>
                  <span>{module.topicId?.title || "Course"}</span>
                </div>
                <h1 className="text-xl font-bold text-white">{module.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Notes
              </button>
              {!isCompleted && (
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" />
                  {completing ? "Saving..." : "Mark Complete"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700/50">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{module.estimatedMinutes} min read</span>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                )}
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <ModuleContent content={content} />
              </div>

              <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-700/50">
                {module.prevModule ? (
                  <button
                    onClick={() => onPrevModule(module.prevModule._id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs">Previous</div>
                      <div className="font-semibold">
                        {module.prevModule.title}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div></div>
                )}

                {module.nextModule && (
                  <button
                    onClick={() => onNextModule(module.nextModule._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    <div className="text-right">
                      <div className="text-xs opacity-90">Next</div>
                      <div className="font-semibold">
                        {module.nextModule.title}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {isCompleted && (
              <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-6 mt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Module Completed! 🎉
                    </h3>
                    <p className="text-gray-300">
                      Great job! Keep up the momentum.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {showNotes && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  Your Notes
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full bg-gray-900/50 text-white border border-gray-700 rounded-lg p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveNote}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-white">Learning</div>
                  <div className="text-xs text-gray-400">Keep going!</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                  <Bookmark className="w-4 h-4" />
                  Bookmark
                </button>
                <button onClick={() => handleShareModule(module, module.topicId._id)} className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button onClick={() => handleDownloadModule(module, content)} className="w-full bg-gray-700/50 hover:bg-gray-700 text-white py-2.5 rounded-lg transition flex items-center justify-center gap-2 text-sm">
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuleContentPage;
