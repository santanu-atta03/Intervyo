// import InterviewSession from '../models/InterviewSession.js';
// import Interview from '../models/Interview.js';
// import {
//   evaluateAnswer,
//   generateNextQuestion,
// } from '../config/openai.js';
// import { textToSpeech } from '../config/elevenlabs.js';

// const activeRooms = new Map();

// export default (io) => {
//   io.on('connection', (socket) => {
//     console.log('✅ New client connected:', socket.id);

//     // Helper to send AI message
//     const sendAIMessage = async (roomId, data, toSocket = null) => {
//       try {
//         console.log('📤 Sending AI message:', data.type);

//         // Try to generate audio
//         let audioBuffer = null;
//         try {
//           audioBuffer = await textToSpeech(data.message);
//         } catch (error) {
//           console.log('⚠️ TTS failed, using fallback');
//         }

//         const payload = audioBuffer ? {
//           ...data,
//           audioBase64: audioBuffer.toString('base64'),
//           hasAudio: true
//         } : {
//           ...data,
//           hasAudio: false,
//           useFallbackTTS: true
//         };

//         // Send message
//         if (toSocket) {
//           toSocket.emit('ai-message', payload);
//         } else {
//           io.to(roomId).emit('ai-message', payload);
//         }

//         console.log('✅ AI message sent');
//       } catch (error) {
//         console.error('❌ Error in sendAIMessage:', error);
//         // Send without audio as fallback
//         const payload = { ...data, hasAudio: false, useFallbackTTS: true };
//         if (toSocket) {
//           toSocket.emit('ai-message', payload);
//         } else {
//           io.to(roomId).emit('ai-message', payload);
//         }
//       }
//     };

//     // Join interview room
//     socket.on('join-room', async ({ roomId, userId }) => {
//       try {
//         socket.join(roomId);
//         activeRooms.set(socket.id, { roomId, userId });
//         console.log(`✅ User ${userId} joined room ${roomId}`);
//         socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
//       } catch (error) {
//         console.error('❌ Join room error:', error);
//         socket.emit('error', { message: 'Failed to join room' });
//       }
//     });

//     // Candidate ready - START INTERVIEW FLOW
//     socket.on('candidate-ready', async ({ sessionId, interviewId }) => {
//       try {
//         console.log('🎬 Starting interview:', { sessionId, interviewId });

//         const interview = await Interview.findById(interviewId);
//         const session = await InterviewSession.findById(sessionId);

//         if (!session || !interview) {
//           socket.emit('error', { message: 'Session or interview not found' });
//           return;
//         }

//         // Send ready acknowledgment
//         socket.emit('interview-ready', {
//           sessionId: session._id,
//           interviewId: interview._id
//         });

//         console.log('📢 Sending greeting...');

//         // GREETING
//         // const greetingMsg = `Hello! Welcome to your ${interview.role} interview. I'm your AI interviewer. Let's get started!`;
//         const greetingMsg = `Hello! Welcome `;

//         await sendAIMessage(socket.id, {
//           type: 'greeting',
//           message: greetingMsg,
//           timestamp: new Date()
//         }, socket);

//         // Save greeting
//         session.conversation.push({
//           speaker: 'ai',
//           message: greetingMsg,
//           type: 'greeting',
//           timestamp: new Date()
//         });
//         await session.save();

//         // Wait 3 seconds then send first question
//         setTimeout(async () => {
//           console.log('❓ Sending first question...');

//           const firstQ = "Tell me about yourself ";
//           // const firstQ = "Tell me about yourself and your experience in this field.";

//           await sendAIMessage(socket.id, {
//             type: 'question',
//             message: firstQ,
//             questionIndex: 0,
//             requiresCode: false,
//             timestamp: new Date()
//           }, socket);

//           // Save question
//           session.conversation.push({
//             speaker: 'ai',
//             message: firstQ,
//             type: 'question',
//             timestamp: new Date()
//           });
//           await session.save();

//           console.log('✅ First question sent');
//         }, 3000);

//       } catch (error) {
//         console.error('❌ Candidate ready error:', error);
//         socket.emit('error', { message: 'Failed to start interview' });
//       }
//     });

//     // Candidate answer - MAIN FLOW
//     socket.on('candidate-answer', async ({ sessionId, question, answer, questionIndex }) => {
//       try {
//         console.log('💬 Received answer for question', questionIndex);

//         const session = await InterviewSession.findById(sessionId).populate('interviewId');

//         if (!session) {
//           socket.emit('error', { message: 'Session not found' });
//           return;
//         }

//         // Send processing status
//         socket.emit('ai-status', {
//           status: 'processing',
//           message: 'Analyzing your response...'
//         });

//         // Save candidate answer IMMEDIATELY
//         session.conversation.push({
//           speaker: 'candidate',
//           message: answer,
//           type: 'answer',
//           timestamp: new Date()
//         });

//         // Evaluate answer with fallback
//         let evaluation;
//         try {
//           console.log('🔍 Evaluating answer...');
//           const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}`;
//           evaluation = await evaluateAnswer(question, answer, context);
//           console.log('✅ Evaluation done:', evaluation.score);
//         } catch (error) {
//           console.error('⚠️ Evaluation failed, using fallback');
//           evaluation = {
//             review: `Thank you for your answer. You provided a ${answer.length > 100 ? 'detailed' : 'good'} response.`,
//             score: answer.length > 100 ? 7 : 6,
//             strength: 'Clear communication',
//             improvement: 'Keep it up'
//           };
//         }

//         // Save evaluation
//         session.questionEvaluations.push({
//           question: question,
//           answer: answer,
//           score: evaluation.score,
//           maxScore: 10,
//           feedback: evaluation.review,
//           category: 'technical',
//           timestamp: new Date()
//         });

//         // Update scores
//         const evals = session.questionEvaluations;
//         if (evals.length > 0) {
//           const avgScore = evals.reduce((sum, e) => sum + e.score, 0) / evals.length;
//           session.technicalScore = avgScore;
//           session.communicationScore = Math.min(avgScore + 1, 10);
//           session.problemSolvingScore = avgScore;
//         }

//         session.currentQuestionIndex += 1;
//         await session.save();

//         // Send review (SHORT AND FAST)
//         setTimeout(async () => {
//           const reviewMsg = `Good! I'd rate that ${evaluation.score} out of 10. ${evaluation.strength}.`;

//           await sendAIMessage(socket.id, {
//             type: 'review',
//             message: reviewMsg,
//             score: evaluation.score,
//             strength: evaluation.strength,
//             improvement: evaluation.improvement,
//             timestamp: new Date()
//           }, socket);

//           // Save review
//           session.conversation.push({
//             speaker: 'ai',
//             message: reviewMsg,
//             type: 'feedback',
//             timestamp: new Date()
//           });
//           await session.save();

//           // IMMEDIATELY send next question after short delay
//           setTimeout(async () => {
//             console.log('❓ Generating next question...');

//             let nextQ;
//             try {
//               nextQ = await generateNextQuestion(
//                 session.questionEvaluations,
//                 session.interviewId.role,
//                 session.interviewId.difficulty
//               );
//             } catch (error) {
//               console.log('⚠️ Using fallback question');
//               const fallbackQuestions = [
//                 "What are your greatest strengths for this role?",
//                 "Tell me about a challenging project you worked on.",
//                 "How do you handle tight deadlines?",
//                 "What technologies are you most comfortable with?",
//                 "Describe your problem-solving approach.",
//                 "How do you stay updated with industry trends?",
//                 "Tell me about a time you failed and what you learned."
//               ];
//               nextQ = {
//                 question: fallbackQuestions[session.currentQuestionIndex % fallbackQuestions.length],
//                 type: 'behavioral',
//                 requiresCode: false
//               };
//             }

//             console.log('📤 Sending next question...');

//             await sendAIMessage(socket.id, {
//               type: 'question',
//               message: nextQ.question,
//               questionType: nextQ.type,
//               questionIndex: session.currentQuestionIndex,
//               requiresCode: nextQ.requiresCode || false,
//               timestamp: new Date()
//             }, socket);

//             // Save next question
//             session.conversation.push({
//               speaker: 'ai',
//               message: nextQ.question,
//               type: 'question',
//               timestamp: new Date()
//             });
//             await session.save();

//             console.log('✅ Next question sent, ready for answer');

//           }, 2000); // 2 seconds after review

//         }, 1000); // 1 second to "think"

//       } catch (error) {
//         console.error('❌ Answer processing error:', error);
//         socket.emit('error', {
//           message: 'Failed to process answer. Please try again.',
//           details: error.message
//         });

//         // Send a fallback question anyway to keep flow going
//         setTimeout(async () => {
//           await sendAIMessage(socket.id, {
//             type: 'question',
//             message: "Let's continue. Tell me about your technical skills.",
//             questionIndex: session?.currentQuestionIndex || 0,
//             requiresCode: false,
//             timestamp: new Date()
//           }, socket);
//         }, 2000);
//       }
//     });

//     // Code submission
//     socket.on('submit-code', async ({ sessionId, question, code, language }) => {
//       try {
//         console.log('💻 Code submission received');

//         const session = await InterviewSession.findById(sessionId).populate('interviewId');

//         if (!session) {
//           socket.emit('error', { message: 'Session not found' });
//           return;
//         }

//         socket.emit('ai-status', {
//           status: 'processing',
//           message: 'Reviewing your code...'
//         });

//         const context = `Role: ${session.interviewId.role}, Language: ${language}`;

//         let evaluation;
//         try {
//           evaluation = await evaluateAnswer(question, 'Code submission', context, code);
//         } catch (error) {
//           evaluation = {
//             review: 'Thank you for your code submission. The implementation looks good!',
//             score: 7,
//             strength: 'Code structure',
//             improvement: 'Consider edge cases'
//           };
//         }

//         // Save code submission
//         session.codeSubmissions.push({
//           questionId: String(session.currentQuestionIndex),
//           question: question,
//           code: code,
//           language: language,
//           score: evaluation.score,
//           feedback: evaluation.review,
//           submittedAt: new Date()
//         });

//         session.questionEvaluations.push({
//           question: question,
//           answer: `Code in ${language}`,
//           score: evaluation.score,
//           maxScore: 10,
//           feedback: evaluation.review,
//           category: 'coding',
//           timestamp: new Date()
//         });

//         await session.save();

//         // Send code review
//         setTimeout(async () => {
//           const codeReviewMsg = `Great! Your code scores ${evaluation.score}/10. ${evaluation.strength}.`;

//           await sendAIMessage(socket.id, {
//             type: 'code-review',
//             message: codeReviewMsg,
//             score: evaluation.score,
//             strength: evaluation.strength,
//             improvement: evaluation.improvement,
//             timestamp: new Date()
//           }, socket);

//           session.conversation.push({
//             speaker: 'ai',
//             message: codeReviewMsg,
//             type: 'feedback',
//             timestamp: new Date()
//           });
//           await session.save();
//         }, 1500);

//       } catch (error) {
//         console.error('❌ Code submission error:', error);
//         socket.emit('error', { message: 'Failed to process code' });
//       }
//     });

//     // End interview
//     socket.on('end-interview', async ({ sessionId, interviewId }) => {
//       try {
//         console.log('🏁 Ending interview');

//         const closingMsg = "Thank you for your time! I'll prepare your feedback now.";

//         await sendAIMessage(socket.id, {
//           type: 'closing',
//           message: closingMsg,
//           timestamp: new Date()
//         }, socket);

//         const session = await InterviewSession.findById(sessionId);
//         if (session) {
//           session.conversation.push({
//             speaker: 'ai',
//             message: closingMsg,
//             type: 'closing',
//             timestamp: new Date()
//           });
//           session.sessionStatus = 'completed';
//           await session.save();
//         }

//         setTimeout(() => {
//           socket.emit('interview-ended', { sessionId, interviewId });
//         }, 3000);
//       } catch (error) {
//         console.error('❌ End interview error:', error);
//         socket.emit('error', { message: 'Failed to end interview' });
//       }
//     });

//     // WebRTC signaling
//     socket.on('offer', ({ to, offer }) => {
//       socket.to(to).emit('offer', { from: socket.id, offer });
//     });

//     socket.on('answer', ({ to, answer }) => {
//       socket.to(to).emit('answer', { from: socket.id, answer });
//     });

//     socket.on('ice-candidate', ({ to, candidate }) => {
//       socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
//     });

//     // Disconnect handler
//     socket.on('disconnect', () => {
//       const roomData = activeRooms.get(socket.id);
//       if (roomData) {
//         socket.to(roomData.roomId).emit('user-left', { socketId: socket.id });
//         activeRooms.delete(socket.id);
//       }
//       console.log('❌ Client disconnected:', socket.id);
//     });
//   });
// };

// import InterviewSession from '../models/InterviewSession.js';
// import Interview from '../models/Interview.js';
// import User from '../models/User.model.js'
// import {
//   evaluateAnswer,
//   generateNextQuestion,
// } from '../config/openai.js';
// import { textToSpeech } from '../config/elevenlabs.js';
// import {
//   calculateXP,
//   checkAndAwardBadges,
//   updateUserStreak
// } from '../services/gamification.service.js';
// import { updateUserStreakAndStats } from '../controllers/aiController.js';
// const activeRooms = new Map();

// export default (io) => {
//   io.on('connection', (socket) => {
//     console.log('✅ New client connected:', socket.id);

//     // Helper to send AI message
//     const sendAIMessage = async (roomId, data, toSocket = null) => {
//       try {
//         console.log('📤 Sending AI message:', data.type);

//         let audioBuffer = null;
//         try {
//           audioBuffer = await textToSpeech(data.message);
//         } catch (error) {
//           console.log('⚠️ TTS failed, using fallback');
//         }

//         const payload = audioBuffer ? {
//           ...data,
//           audioBase64: audioBuffer.toString('base64'),
//           hasAudio: true
//         } : {
//           ...data,
//           hasAudio: false,
//           useFallbackTTS: true
//         };

//         if (toSocket) {
//           toSocket.emit('ai-message', payload);
//         } else {
//           io.to(roomId).emit('ai-message', payload);
//         }

//         console.log('✅ AI message sent');
//       } catch (error) {
//         console.error('❌ Error in sendAIMessage:', error);
//         const payload = { ...data, hasAudio: false, useFallbackTTS: true };
//         if (toSocket) {
//           toSocket.emit('ai-message', payload);
//         } else {
//           io.to(roomId).emit('ai-message', payload);
//         }
//       }
//     };

//     // Join interview room
//     socket.on('join-room', async ({ roomId, userId }) => {
//       try {
//         socket.join(roomId);
//         activeRooms.set(socket.id, { roomId, userId });
//         console.log(`✅ User ${userId} joined room ${roomId}`);
//         socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
//       } catch (error) {
//         console.error('❌ Join room error:', error);
//         socket.emit('error', { message: 'Failed to join room' });
//       }
//     });

//     // Candidate ready - START INTERVIEW FLOW
//     socket.on('candidate-ready', async ({ sessionId, interviewId }) => {
//       try {
//         console.log('🎬 Starting interview:', { sessionId, interviewId });

//         const interview = await Interview.findById(interviewId);
//         const session = await InterviewSession.findById(sessionId);

//         if (!session || !interview) {
//           socket.emit('error', { message: 'Session or interview not found' });
//           return;
//         }

//         socket.emit('interview-ready', {
//           sessionId: session._id,
//           interviewId: interview._id
//         });

//         console.log('📢 Sending greeting...');

//         const greetingMsg = `Hello! Welcome to your ${interview.role} interview. I'm your AI interviewer, and I'm excited to learn more about you today. Let's have a great conversation!`;

//         await sendAIMessage(socket.id, {
//           type: 'greeting',
//           message: greetingMsg,
//           timestamp: new Date()
//         }, socket);

//         session.conversation.push({
//           speaker: 'ai',
//           message: greetingMsg,
//           type: 'greeting',
//           timestamp: new Date()
//         });
//         await session.save();

//         setTimeout(async () => {
//           console.log('❓ Sending first question...');

//           const firstQ = "Let's start with you telling me about yourself and your experience in this field. What draws you to this role?";

//           await sendAIMessage(socket.id, {
//             type: 'question',
//             message: firstQ,
//             questionIndex: 0,
//             requiresCode: false,
//             timestamp: new Date()
//           }, socket);

//           session.conversation.push({
//             speaker: 'ai',
//             message: firstQ,
//             type: 'question',
//             timestamp: new Date()
//           });
//           await session.save();

//           console.log('✅ First question sent');
//         }, 3000);

//       } catch (error) {
//         console.error('❌ Candidate ready error:', error);
//         socket.emit('error', { message: 'Failed to start interview' });
//       }
//     });

//     // Candidate answer - MAIN FLOW
//     socket.on('candidate-answer', async ({ sessionId, question, answer, questionIndex }) => {
//       try {
//         console.log('💬 Received answer for question', questionIndex);

//         const session = await InterviewSession.findById(sessionId).populate('interviewId');

//         if (!session) {
//           socket.emit('error', { message: 'Session not found' });
//           return;
//         }

//         socket.emit('ai-status', {
//           status: 'processing',
//           message: 'Analyzing your response...'
//         });

//         // Save candidate answer
//         session.conversation.push({
//           speaker: 'candidate',
//           message: answer,
//           type: 'answer',
//           timestamp: new Date()
//         });

//         // Evaluate answer with conversational feedback
//         let evaluation;
//         try {
//           console.log('🔍 Evaluating answer...');
//           const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}`;
//           evaluation = await evaluateAnswer(question, answer, context);
//           console.log('✅ Evaluation done:', evaluation);
//         } catch (error) {
//           console.error('⚠️ Evaluation failed, using fallback');
//           evaluation = {
//             review: getConversationalFeedback(answer),
//             score: answer.length > 150 ? 8 : 6,
//             strength: 'Clear communication',
//             improvement: 'Keep elaborating on your experiences'
//           };
//         }

//         // Save evaluation
//         session.questionEvaluations.push({
//           question: question,
//           answer: answer,
//           score: evaluation.score,
//           maxScore: 10,
//           feedback: evaluation.review,
//           category: 'technical',
//           timestamp: new Date()
//         });

//         // Update scores
//         const evals = session.questionEvaluations;
//         if (evals.length > 0) {
//           const avgScore = evals.reduce((sum, e) => sum + e.score, 0) / evals.length;
//           session.technicalScore = avgScore;
//           session.communicationScore = Math.min(avgScore + 1, 10);
//           session.problemSolvingScore = avgScore;
//         }

//         session.currentQuestionIndex += 1;
//         await session.save();

//         // Send natural conversational review
//         setTimeout(async () => {
//           const reviewMsg = getNaturalReview(evaluation);

//           await sendAIMessage(socket.id, {
//             type: 'review',
//             message: reviewMsg,
//             score: evaluation.score,
//             strength: evaluation.strength,
//             improvement: evaluation.improvement,
//             timestamp: new Date()
//           }, socket);

//           session.conversation.push({
//             speaker: 'ai',
//             message: reviewMsg,
//             type: 'feedback',
//             timestamp: new Date()
//           });
//           await session.save();

//           // Send next question
//           setTimeout(async () => {
//             console.log('❓ Generating next question...');

//             let nextQ;
//             try {
//               nextQ = await generateNextQuestion(
//                 session.questionEvaluations,
//                 session.interviewId.role,
//                 session.interviewId.difficulty
//               );
//             } catch (error) {
//               console.log('⚠️ Using fallback question');
//               nextQ = getFallbackQuestion(session.currentQuestionIndex, session.interviewId.difficulty);
//             }

//             console.log('📤 Sending next question...');

//             await sendAIMessage(socket.id, {
//               type: 'question',
//               message: nextQ.question,
//               questionType: nextQ.type,
//               questionIndex: session.currentQuestionIndex,
//               requiresCode: nextQ.requiresCode || false,
//               timestamp: new Date()
//             }, socket);

//             session.conversation.push({
//               speaker: 'ai',
//               message: nextQ.question,
//               type: 'question',
//               timestamp: new Date()
//             });
//             await session.save();

//             console.log('✅ Next question sent');

//           }, 2000);

//         }, 1000);

//       } catch (error) {
//         console.error('❌ Answer processing error:', error);
//         socket.emit('error', {
//           message: 'Failed to process answer. Please try again.',
//           details: error.message
//         });

//         setTimeout(async () => {
//           await sendAIMessage(socket.id, {
//             type: 'question',
//             message: "Let's continue. Tell me about a challenging project you've worked on.",
//             questionIndex: session?.currentQuestionIndex || 0,
//             requiresCode: false,
//             timestamp: new Date()
//           }, socket);
//         }, 2000);
//       }
//     });

//     // Code submission
//     socket.on('submit-code', async ({ sessionId, question, code, language }) => {
//       try {
//         console.log('💻 Code submission received');

//         const session = await InterviewSession.findById(sessionId).populate('interviewId');

//         if (!session) {
//           socket.emit('error', { message: 'Session not found' });
//           return;
//         }

//         socket.emit('ai-status', {
//           status: 'processing',
//           message: 'Reviewing your code...'
//         });

//         const context = `Role: ${session.interviewId.role}, Language: ${language}`;

//         let evaluation;
//         try {
//           evaluation = await evaluateAnswer(question, 'Code submission', context, code);
//         } catch (error) {
//           evaluation = {
//             review: 'Thanks for sharing your solution! The code structure looks solid.',
//             score: 7,
//             strength: 'Code organization',
//             improvement: 'Consider edge cases'
//           };
//         }

//         session.codeSubmissions.push({
//           questionId: String(session.currentQuestionIndex),
//           question: question,
//           code: code,
//           language: language,
//           score: evaluation.score,
//           feedback: evaluation.review,
//           submittedAt: new Date()
//         });

//         session.questionEvaluations.push({
//           question: question,
//           answer: `Code in ${language}`,
//           score: evaluation.score,
//           maxScore: 10,
//           feedback: evaluation.review,
//           category: 'coding',
//           timestamp: new Date()
//         });

//         await session.save();

//         setTimeout(async () => {
//           const codeReviewMsg = getCodeReview(evaluation);

//           await sendAIMessage(socket.id, {
//             type: 'code-review',
//             message: codeReviewMsg,
//             score: evaluation.score,
//             strength: evaluation.strength,
//             improvement: evaluation.improvement,
//             timestamp: new Date()
//           }, socket);

//           session.conversation.push({
//             speaker: 'ai',
//             message: codeReviewMsg,
//             type: 'feedback',
//             timestamp: new Date()
//           });
//           await session.save();
//         }, 1500);

//       } catch (error) {
//         console.error('❌ Code submission error:', error);
//         socket.emit('error', { message: 'Failed to process code' });
//       }
//     });

//     // End interview
//     // socket.on('end-interview', async ({ sessionId, interviewId }) => {
//     //   try {
//     //     console.log('🏁 Ending interview');

//     //     const closingMsg = "Thank you so much for your time today! You've shared some great insights. I'll now compile your feedback report.";

//     //     await sendAIMessage(socket.id, {
//     //       type: 'closing',
//     //       message: closingMsg,
//     //       timestamp: new Date()
//     //     }, socket);

//     //     const session = await InterviewSession.findById(sessionId);
//     //     if (session) {
//     //       session.conversation.push({
//     //         speaker: 'ai',
//     //         message: closingMsg,
//     //         type: 'closing',
//     //         timestamp: new Date()
//     //       });
//     //       session.sessionStatus = 'completed';
//     //       await session.save();
//     //     }

//     //     setTimeout(() => {
//     //       socket.emit('interview-ended', { sessionId, interviewId });
//     //     }, 3000);
//     //   } catch (error) {
//     //     console.error('❌ End interview error:', error);
//     //     socket.emit('error', { message: 'Failed to end interview' });
//     //   }
//     // });

//     socket.on('end-interview', async ({ sessionId, interviewId }) => {
//       try {
//         console.log('🏁 Ending interview with gamification');

//         const session = await InterviewSession.findById(sessionId);
//         const interview = await Interview.findById(interviewId);

//         if (!session || !interview) {
//           socket.emit('error', { message: 'Session or interview not found' });
//           return;
//         }

//         // 1. Update interview status
//         interview.status = 'completed';
//         interview.completedAt = new Date();

//         // Calculate overall score from evaluations
//         const evaluations = session.questionEvaluations;
//         if (evaluations.length > 0) {
//           const totalScore = evaluations.reduce((sum, e) => sum + e.score, 0);
//           const avgScore = (totalScore / evaluations.length) * 10; // Convert to 0-100
//           interview.overallScore = Math.round(avgScore);
//         } else {
//           interview.overallScore = 0;
//         }

//         await interview.save();

//         // 2. Update session status
//         session.sessionStatus = 'completed';
//         await session.save();

//         // 3. CALCULATE AND AWARD XP
//         const xpBreakdown = calculateXP(interview, session);
//         console.log('💎 XP Breakdown:', xpBreakdown);

//         // 4. UPDATE USER WITH XP
//         const user = await User.findById(interview.userId);
//         if (!user) {
//           console.error('User not found');
//           socket.emit('interview-ended', { sessionId, interviewId });
//           return;
//         }

//         const oldLevel = user.stats.level;
//         const oldXP = user.stats.xpPoints;

//         // Add XP
//         user.stats.xpPoints += xpBreakdown.totalXP;
//         user.stats.totalInterviews = (user.stats.totalInterviews || 0) + 1;

//         // Calculate new level (500 XP per level)
//         const newLevel = Math.floor(user.stats.xpPoints / 500) + 1;
//         const leveledUp = newLevel > oldLevel;

//         if (leveledUp) {
//           user.stats.level = newLevel;
//           console.log(`🎉 LEVEL UP! ${oldLevel} → ${newLevel}`);
//         }

//         // 5. UPDATE STREAK
//         const streakData = await updateUserStreakAndStats(user);
//         console.log('🔥 Streak updated:', streakData);

//         await user.save();

//         // 6. CHECK AND AWARD BADGES
//         const { newBadges, totalXPAwarded } = await checkAndAwardBadges(interview.userId);
//         console.log('🏆 New badges awarded:', newBadges.length);

//         if (totalXPAwarded > 0) {
//           // Refresh user to get updated stats after badge XP
//           const updatedUser = await User.findById(interview.userId);
//           const finalLevel = Math.floor(updatedUser.stats.xpPoints / 500) + 1;

//           if (finalLevel > newLevel) {
//             console.log(`🎉 BONUS LEVEL UP from badges! ${newLevel} → ${finalLevel}`);
//           }
//         }

//         // 7. EMIT GAMIFICATION UPDATES TO CLIENT
//         socket.emit('gamification-update', {
//           xpEarned: xpBreakdown.totalXP,
//           xpBreakdown: xpBreakdown,
//           totalXP: user.stats.xpPoints,
//           level: user.stats.level,
//           leveledUp: leveledUp,
//           oldLevel: oldLevel,
//           newLevel: user.stats.level,
//           streak: user.stats.streak,
//           streakIncreased: streakData.streakIncreased,
//           newBadges: newBadges,
//           badgeXP: totalXPAwarded
//         });

//         // 8. Send closing message
//         const closingMsg = `Amazing work! Let me prepare your detailed feedback.`;

//         await sendAIMessage(socket.id, {
//           type: 'closing',
//           message: closingMsg,
//           timestamp: new Date()
//         }, socket);

//         session.conversation.push({
//           speaker: 'ai',
//           message: closingMsg,
//           type: 'closing',
//           timestamp: new Date()
//         });
//         await session.save();

//         // 9. Redirect to results after delay
//         setTimeout(() => {
//           socket.emit('interview-ended', {
//             sessionId,
//             interviewId,
//             gamification: {
//               xpEarned: xpBreakdown.totalXP,
//               leveledUp,
//               newLevel: user.stats.level,
//               badges: newBadges
//             }
//           });
//         }, 4000);

//       } catch (error) {
//         console.error('❌ End interview error:', error);
//         socket.emit('error', { message: 'Failed to end interview' });
//       }
//     });

//     // WebRTC signaling
//     socket.on('offer', ({ to, offer }) => {
//       socket.to(to).emit('offer', { from: socket.id, offer });
//     });

//     socket.on('answer', ({ to, answer }) => {
//       socket.to(to).emit('answer', { from: socket.id, answer });
//     });

//     socket.on('ice-candidate', ({ to, candidate }) => {
//       socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
//     });

//     socket.on('disconnect', () => {
//       const roomData = activeRooms.get(socket.id);
//       if (roomData) {
//         socket.to(roomData.roomId).emit('user-left', { socketId: socket.id });
//         activeRooms.delete(socket.id);
//       }
//       console.log('❌ Client disconnected:', socket.id);
//     });
//   });
// };

// // Helper functions for natural conversational feedback
// function getNaturalReview(evaluation) {
//   const score = evaluation.score;
//   const strength = evaluation.strength;

//   if (score >= 9) {
//     return `Excellent answer! ${evaluation.review} ${strength ? `I especially liked your ${strength.toLowerCase()}.` : ''} That's exactly the kind of depth I was looking for.`;
//   } else if (score >= 7) {
//     return `Great response! ${evaluation.review} ${strength ? `Your ${strength.toLowerCase()} really stood out.` : ''} Keep up that level of detail.`;
//   } else if (score >= 5) {
//     return `Good start! ${evaluation.review} ${strength ? `I appreciate your ${strength.toLowerCase()}.` : ''} ${evaluation.improvement ? `For next time, try to ${evaluation.improvement.toLowerCase()}.` : ''}`;
//   } else {
//     return `Thank you for sharing. ${evaluation.review} ${evaluation.improvement ? `I'd encourage you to ${evaluation.improvement.toLowerCase()}.` : ''} Let's move forward.`;
//   }
// }

// function getCodeReview(evaluation) {
//   const score = evaluation.score;

//   if (score >= 9) {
//     return `Impressive code! ${evaluation.review} Your implementation shows strong problem-solving skills. ${evaluation.strength ? `The ${evaluation.strength.toLowerCase()} is particularly well done.` : ''}`;
//   } else if (score >= 7) {
//     return `Nice work on this solution! ${evaluation.review} ${evaluation.strength ? `I like your approach to ${evaluation.strength.toLowerCase()}.` : ''} ${evaluation.improvement ? `One thing to consider: ${evaluation.improvement.toLowerCase()}.` : ''}`;
//   } else {
//     return `Thanks for your solution. ${evaluation.review} ${evaluation.improvement ? `For improvement, think about ${evaluation.improvement.toLowerCase()}.` : ''} Let's continue.`;
//   }
// }

// function getConversationalFeedback(answer) {
//   const length = answer.length;
//   if (length > 200) {
//     return "That was a very thorough explanation. You covered multiple aspects clearly.";
//   } else if (length > 100) {
//     return "Good answer. You touched on the key points effectively.";
//   } else {
//     return "Thank you for that. Could you elaborate a bit more in your next responses?";
//   }
// }

// function getFallbackQuestion(index, difficulty) {
//   const questions = {
//     easy: [
//       { question: "What are your greatest strengths for this role?", type: "behavioral", requiresCode: false },
//       { question: "Tell me about a project you're proud of.", type: "behavioral", requiresCode: false },
//       { question: "How do you handle constructive criticism?", type: "behavioral", requiresCode: false },
//       { question: "Can you write a function to reverse a string? Let me see your code.", type: "coding", requiresCode: true },
//     ],
//     medium: [
//       { question: "Describe a challenging technical problem you solved recently.", type: "technical", requiresCode: false },
//       { question: "How do you approach debugging complex issues?", type: "technical", requiresCode: false },
//       { question: "Tell me about a time you had to learn a new technology quickly.", type: "behavioral", requiresCode: false },
//       { question: "Can you implement a function to find duplicates in an array? Show me your solution.", type: "coding", requiresCode: true },
//     ],
//     hard: [
//       { question: "Explain how you would design a scalable system architecture.", type: "technical", requiresCode: false },
//       { question: "Describe your experience with performance optimization.", type: "technical", requiresCode: false },
//       { question: "How do you handle technical debt in large projects?", type: "technical", requiresCode: false },
//       { question: "Implement a debounce function. Let's see your code.", type: "coding", requiresCode: true },
//     ]
//   };

//   const difficultyQuestions = questions[difficulty] || questions.medium;
//   return difficultyQuestions[index % difficultyQuestions.length];
// }

// ============================================
// COMPLETE SOCKET HANDLER WITH DYNAMIC QUESTION FLOW
// sockets/interviewSocket.js
// ============================================

// ============================================
// ENHANCED SOCKET HANDLER
// File: sockets/interviewSocket.js
// ============================================

import InterviewSession from "../models/InterviewSession.js";
import Interview from "../models/Interview.model.js";
import { evaluateAnswer } from "../config/openai.js";
import { textToSpeech } from "../config/elevenlabs.js";
import answerEvaluator from "../services/answerEvaluator.js";
import {
  getInterviewDetails,
} from "../utils/interviewConfig.js";
import {
  calculateXP,
  checkAndAwardBadges,
  updateUserStreak,
} from "../services/gamification.service.js";

// ============================================
// ACTIVE SESSIONS TRACKING
// ============================================
const activeSessions = new Map(); // sessionId -> question plan and progress
const questionTimers = new Map(); // sessionId -> timer
const performanceCache = new Map(); // sessionId -> performance stats
const socketToSession = new Map(); // socket.id -> sessionId
const pausedSessions = new Set();
const SPEECH_TIMEOUT_MS = 8000;

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() =>
    clearTimeout(timeoutId),
  );
}

function clearQuestionTimers(sessionId) {
  const prefix = `${sessionId}-`;
  for (const key of questionTimers.keys()) {
    if (key.startsWith(prefix)) questionTimers.delete(key);
  }
}

function getInterviewQuestions(interview) {
  return (interview.rounds || []).flatMap((round) => round.questions || []);
}

function getQuestionPlan(interview) {
  const questions = getInterviewQuestions(interview);
  return {
    totalQuestions: questions.length,
    technical: questions.filter((question) => question.type === "technical").length,
    behavioral: questions.filter((question) => question.type === "behavioral").length,
    coding: questions.filter((question) => question.type === "coding").length,
  };
}

// ============================================
// QUESTION GENERATION STRATEGY
// ============================================
const QUESTION_CATEGORIES = {
  GREETING: "greeting",
  TECHNICAL: "technical",
  BEHAVIORAL: "behavioral",
  CODING: "coding",
  PROBLEM_SOLVING: "problem-solving",
  CLOSING: "closing",
};

// ============================================
// PERFORMANCE TRACKING
// ============================================
function updatePerformanceMetrics(sessionId, evaluation) {
  const metrics = performanceCache.get(sessionId) || {
    scores: [],
    technicalScores: [],
    behavioralScores: [],
    codingScores: [],
    perfectAnswers: 0,
    streak: 0,
  };

  metrics.scores.push(evaluation.score);

  if (
    evaluation.category === "technical" ||
    evaluation.category === "system-design"
  ) {
    metrics.technicalScores.push(evaluation.score);
  } else if (evaluation.category === "behavioral") {
    metrics.behavioralScores.push(evaluation.score);
  } else if (evaluation.category === "coding") {
    metrics.codingScores.push(evaluation.score);
  }

  if (evaluation.score === 10) {
    metrics.perfectAnswers++;
  }

  if (evaluation.score >= 7) {
    metrics.streak++;
  } else {
    metrics.streak = 0;
  }

  performanceCache.set(sessionId, metrics);
  return metrics;
}

function getPerformanceStats(sessionId) {
  const metrics = performanceCache.get(sessionId);
  if (!metrics || metrics.scores.length === 0) {
    return {
      averageScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      problemSolvingScore: 0,
      currentStreak: 0,
      questionsAnswered: 0,
      perfectAnswers: 0,
    };
  }

  const avg = (arr) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    averageScore: Math.round(avg(metrics.scores) * 10) / 10,
    technicalScore: Math.round(avg(metrics.technicalScores) * 10) / 10,
    communicationScore: Math.round(avg(metrics.behavioralScores) * 10) / 10,
    problemSolvingScore: Math.round(avg(metrics.codingScores) * 10) / 10,
    currentStreak: metrics.streak,
    questionsAnswered: metrics.scores.length,
    perfectAnswers: metrics.perfectAnswers,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================
async function sendAIMessage(target, data, io) {
  try {
    let audioBuffer = null;

    // Try to generate TTS audio (optional)
    try {
      if (data.message && data.message.length < 500) {
        audioBuffer = await withTimeout(
          textToSpeech(data.message),
          SPEECH_TIMEOUT_MS,
          "Speech generation timed out",
        );
      }
    } catch (error) {
      console.log("⚠️ TTS skipped:", error.message);
    }

    const payload = audioBuffer
      ? {
          ...data,
          audioBase64: audioBuffer.toString("base64"),
          hasAudio: true,
        }
      : {
          ...data,
          hasAudio: false,
          useFallbackTTS: true,
        };

    // Check if target is a socket or room ID
    if (typeof target === "string") {
      // It's a room ID
      io.to(target).emit("ai-message", payload);
    } else {
      // It's a socket object
      target.emit("ai-message", payload);
    }
  } catch (error) {
    console.error("❌ Error sending AI message:", error);
    const fallbackPayload = {
      ...data,
      hasAudio: false,
      useFallbackTTS: true,
    };
    if (typeof target === "string") {
      io.to(target).emit("ai-message", fallbackPayload);
    } else {
      target.emit("ai-message", fallbackPayload);
    }
  }
}

async function askNextQuestion(socket, session, interview, io) {
  try {
    if (pausedSessions.has(session._id.toString())) return;

    const sessionData = activeSessions.get(session._id.toString());
    if (!sessionData) {
      console.error("Session data not found");
      return;
    }

    const questions = getInterviewQuestions(interview);
    const questionIndex = sessionData.questionsAsked;
    const nextQuestion = questions[questionIndex];
    if (!nextQuestion) {
      await completeInterview(socket, session, interview, io);
      return;
    }

    console.log(`❓ Asking question #${questionIndex + 1}...`);
    const nextCategory = nextQuestion.type || "technical";
    sessionData.categoryCounts[nextCategory] =
      (sessionData.categoryCounts[nextCategory] || 0) + 1;
    sessionData.questionsAsked++;
    activeSessions.set(session._id.toString(), sessionData);

    const questionMsg = nextQuestion.question;
    const requiresCode = false;

    await sendAIMessage(
      socket,
      {
        type: "question",
        message: questionMsg,
        questionType: nextCategory,
        questionIndex,
        requiresCode,
        timestamp: new Date(),
      },
      io,
    );

    session.conversation.push({
      role: "assistant",
      content: questionMsg,
      type: "question",
      questionCategory: nextCategory,
      questionIndex,
      requiresCode,
      timestamp: new Date(),
    });
    await session.save();

    questionTimers.set(
      `${session._id}-${questionIndex}`,
      Date.now(),
    );

    console.log("✅ Question sent");
  } catch (error) {
    console.error("❌ Error asking question:", error);
    socket.emit("error", { message: "Failed to generate question" });
  }
}

function determineNextCategory(sessionData) {
  const { plan, categoryCounts } = sessionData;

  if (categoryCounts.technical < plan.technical) return "technical";
  if (categoryCounts.coding < plan.coding) return "coding";
  if (categoryCounts.behavioral < plan.behavioral) return "behavioral";

  return "technical";
}

async function completeInterview(socket, session, interview, io) {
  try {
    if (session.sessionStatus === "completed") {
      socket.emit("interview-ended", {
        sessionId: session._id,
        interviewId: interview._id,
      });
      return true;
    }

    session.sessionStatus = "completed";
    await session.save();

    // Calculate gamification rewards
    try {
      const xpBreakdown = calculateXP(interview, session);
      const { newBadges } = await checkAndAwardBadges(interview.userId);
      await updateUserStreak(interview.userId);

      socket.emit("gamification-update", {
        xpEarned: xpBreakdown.totalXP,
        xpBreakdown,
        newBadges,
      });
    } catch (error) {
      console.error("⚠️ Gamification error:", error);
    }

    // Cleanup
    activeSessions.delete(session._id.toString());
    performanceCache.delete(session._id.toString());
    pausedSessions.delete(session._id.toString());
    clearQuestionTimers(session._id.toString());
    
    // Remove socket-to-session mapping
    for (const [socketId, sessionId] of socketToSession.entries()) {
      if (sessionId === session._id.toString()) {
        socketToSession.delete(socketId);
        break;
      }
    }

    setTimeout(() => {
      socket.emit("interview-ended", {
        sessionId: session._id,
        interviewId: interview._id,
      });
    }, 4000);

    console.log("✅ Interview completed successfully");
    return true;
  } catch (error) {
    console.error("❌ Error completing interview:", error);
    socket.emit("error", { message: "Failed to complete interview" });
    return false;
  }
}

function getFallbackEvaluation(answer) {
  const wordCount = answer.split(" ").length;
  const hasExample = /example|instance|case|experience/i.test(answer);
  const hasTechnical = /function|class|method|algorithm|data|system/i.test(
    answer,
  );

  let score = 5;
  if (wordCount > 30) score += 1;
  if (wordCount > 60) score += 1;
  if (hasExample) score += 1;
  if (hasTechnical) score += 1;

  return {
    review: "Your answer covers the key points well.",
    score: Math.min(score, 10),
    strength: "Clear communication",
    improvement: "Consider adding more specific examples",
  };
}

function getFallbackCodeEvaluation(code, language) {
  const lines = code.split("\n").length;
  const hasComments = /\/\/|\/\*|\#/.test(code);
  const hasErrorHandling = /try|catch|except|error/i.test(code);

  let score = 6;
  if (lines > 10) score += 1;
  if (hasComments) score += 1;
  if (hasErrorHandling) score += 1;

  return {
    review: `Your ${language} solution is well-structured.`,
    score: Math.min(score, 10),
    strength: "Clean code structure",
    improvement: "Consider edge cases",
  };
}

// ============================================
// MAIN SOCKET HANDLER
// ============================================
export default (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    // =====================================
    // JOIN ROOM
    // =====================================
    socket.on("join-room", async ({ roomId, userId }) => {
      try {
        socket.join(roomId);
        console.log(`✅ User ${userId} joined room ${roomId}`);

        socket.emit("interview-ready", {
          roomId,
          message: "Interview room ready!",
        });
      } catch (error) {
        console.error("❌ Join room error:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // =====================================
    // START INTERVIEW - CANDIDATE READY
    // =====================================
    socket.on("candidate-ready", async ({ sessionId, interviewId, paused }) => {
      try {
        console.log("🎬 Starting interview:", { sessionId, interviewId });
        if (paused) pausedSessions.add(sessionId);
        else pausedSessions.delete(sessionId);

        const interview = await Interview.findById(interviewId);
        const session =
          await InterviewSession.findById(sessionId).populate("interviewId");

        if (!session || !interview) {
          socket.emit("error", { message: "Session or interview not found" });
          return;
        }

        const plan = getQuestionPlan(interview);
        const evaluations = session.questionEvaluations || [];
        if (plan.totalQuestions === 0) {
          socket.emit("error", {
            message: "This interview has no selected questions. Please restart it.",
          });
          return;
        }
        const questionMessages = (session.conversation || []).filter(
          (message) => message.type === "question",
        );
        const categoryCounts = {
          technical: evaluations.filter((item) => item.category === "technical").length,
          behavioral: evaluations.filter((item) => item.category === "behavioral").length,
          coding: evaluations.filter((item) => item.category === "coding").length,
          "system-design": evaluations.filter(
            (item) => item.category === "system-design",
          ).length,
        };
        const scores = evaluations.map((item) => item.score || 0);
        performanceCache.set(sessionId, {
          scores,
          technicalScores: evaluations
            .filter((item) => item.category === "technical")
            .map((item) => item.score || 0),
          behavioralScores: evaluations
            .filter((item) => item.category === "behavioral")
            .map((item) => item.score || 0),
          codingScores: evaluations
            .filter((item) => item.category === "coding")
            .map((item) => item.score || 0),
          perfectAnswers: scores.filter((score) => score === 10).length,
          streak: scores.slice().reverse().every((score) => score >= 7)
            ? scores.length
            : scores
                .slice()
                .reverse()
                .findIndex((score) => score < 7),
        });
        const pendingQuestion =
          questionMessages.length > evaluations.length
            ? questionMessages[questionMessages.length - 1]
            : null;
        const pendingCategory = pendingQuestion?.questionCategory;

        if (pendingQuestion && pendingCategory && categoryCounts[pendingCategory] !== undefined) {
          categoryCounts[pendingCategory] += 1;
        }

        activeSessions.set(sessionId, {
          plan,
          questionsAsked: questionMessages.length,
          categoryCounts,
        });
        
        // Track socket to session mapping for cleanup
        socketToSession.set(socket.id, sessionId);

        if (evaluations.length >= plan.totalQuestions) {
          await completeInterview(socket, session, interview, io);
          return;
        }

        if (pendingQuestion) {
          const questionIndex =
            pendingQuestion.questionIndex ?? evaluations.length;
          const questionCategory =
            pendingCategory ||
            determineNextCategory(activeSessions.get(sessionId));

          socket.emit("ai-message", {
            type: "question",
            message: pendingQuestion.content,
            questionType: questionCategory,
            questionIndex,
            requiresCode: false,
          });
          questionTimers.set(`${sessionId}-${questionIndex}`, Date.now());
          return;
        }

        await askNextQuestion(socket, session, interview, io);
      } catch (error) {
        console.error("❌ Candidate ready error:", error);
        socket.emit("error", { message: "Failed to start interview" });
      }
    });

    socket.on("pause-interview", ({ sessionId }) => {
      if (sessionId && socketToSession.get(socket.id) === sessionId) {
        pausedSessions.add(sessionId);
      }
    });

    socket.on("resume-interview", async ({ sessionId }) => {
      try {
        if (!sessionId || socketToSession.get(socket.id) !== sessionId) return;

        pausedSessions.delete(sessionId);
        const session =
          await InterviewSession.findById(sessionId).populate("interviewId");
        const sessionData = activeSessions.get(sessionId);
        if (!session || !sessionData) {
          socket.emit("error", { message: "Interview session could not be resumed." });
          return;
        }

        const questionMessages = (session.conversation || []).filter(
          (message) => message.type === "question",
        );
        const pendingQuestion =
          questionMessages.length > (session.questionEvaluations || []).length
            ? questionMessages[questionMessages.length - 1]
            : null;

        if (pendingQuestion) {
          const questionCategory =
            pendingQuestion.questionCategory ||
            determineNextCategory(sessionData);
          const questionIndex =
            pendingQuestion.questionIndex ??
            (session.questionEvaluations || []).length;
          socket.emit("ai-message", {
            type: "question",
            message: pendingQuestion.content,
            questionType: questionCategory,
            questionIndex,
            requiresCode: false,
          });
          questionTimers.set(`${sessionId}-${questionIndex}`, Date.now());
          return;
        }

        if (
          (session.questionEvaluations || []).length <
          sessionData.plan.totalQuestions
        ) {
          await askNextQuestion(socket, session, session.interviewId, io);
        } else {
          await completeInterview(socket, session, session.interviewId, io);
        }
      } catch (error) {
        console.error("❌ Interview resume error:", error);
        socket.emit("error", { message: "Failed to resume interview" });
      }
    });

    // =====================================
    // ANSWER SUBMISSION
    // =====================================
    socket.on(
      "candidate-answer",
      async ({ sessionId, answer, questionIndex }, acknowledge) => {
        try {
          if (pausedSessions.has(sessionId)) {
            acknowledge?.({
              success: false,
              message: "Resume the interview before submitting your answer.",
            });
            return;
          }

          console.log("💬 Processing answer for question", questionIndex);

          const session =
            await InterviewSession.findById(sessionId).populate("interviewId");
          if (!session) {
            socket.emit("error", { message: "Session not found" });
            acknowledge?.({ success: false, message: "Session not found" });
            return;
          }

          if (typeof answer !== "string" || !answer.trim()) {
            acknowledge?.({ success: false, message: "Answer cannot be empty." });
            return;
          }

          const evaluations = session.questionEvaluations || [];
          if (
            evaluations.some(
              (evaluation) => evaluation.questionNumber === questionIndex + 1,
            )
          ) {
            acknowledge?.({ success: true, duplicate: true });
            return;
          }

          const questions = getInterviewQuestions(session.interviewId);
          const sourceQuestion = questions[questionIndex];
          const askedQuestions = (session.conversation || []).filter(
            (message) => message.type === "question",
          );
          if (
            !Number.isInteger(questionIndex) ||
            !sourceQuestion ||
            questionIndex !== askedQuestions.length - 1
          ) {
            acknowledge?.({
              success: false,
              message: "The submitted answer does not match an interview question.",
            });
            return;
          }

          socket.emit("ai-status", {
            status: "processing",
            message: "Analyzing your response...",
          });

          const questionTimer = questionTimers.get(
            `${sessionId}-${questionIndex}`,
          );
          questionTimers.delete(`${sessionId}-${questionIndex}`);
          const timeTaken = questionTimer
            ? Math.floor((Date.now() - questionTimer) / 1000)
            : 0;

          const details = getInterviewDetails(session.interviewId);
          const evaluation = await answerEvaluator.evaluateAnswer(
            sourceQuestion,
            answer.trim(),
            {
              role: details.role,
              difficulty: details.difficulty,
              domain: session.interviewId.config?.domain,
              specialization: session.interviewId.config?.subDomain,
            },
          );
          const scoreOutOfTen = Math.max(
            0,
            Math.min(10, Math.round((evaluation.overallScore || 0) / 10)),
          );
          const questionCategory = sourceQuestion.type || "technical";

          const questionEval = {
            questionNumber: questionIndex + 1,
            question: sourceQuestion.question,
            userAnswer: answer.trim(),
            score: scoreOutOfTen,
            feedback: evaluation.feedback,
            category: questionCategory,
            difficulty: details.difficulty,
            strengths: evaluation.strengths || [],
            improvements: evaluation.improvements || [],
            timeSpent: timeTaken,
            timestamp: new Date(),
          };

          session.conversation.push({
            role: "user",
            content: answer.trim(),
            type: "answer",
            timestamp: new Date(),
          });
          session.questionEvaluations.push(questionEval);
          if (!session.stats) session.stats = {};
          session.stats.questionsAnswered = session.questionEvaluations.length;
          session.stats.totalTimeSpent =
            (session.stats.totalTimeSpent || 0) + timeTaken;
          session.stats.averageResponseTime = Math.round(
            session.stats.totalTimeSpent / session.stats.questionsAnswered,
          );

          updatePerformanceMetrics(sessionId, {
            score: scoreOutOfTen,
            category: questionCategory,
          });

          const sourceRound = (session.interviewId.rounds || []).find((round) =>
            round.questions?.some(
              (candidateQuestion) =>
                candidateQuestion.questionId === sourceQuestion.questionId,
            ),
          );
          const alreadySaved = sourceRound?.answers?.some(
            (savedAnswer) => savedAnswer.questionId === sourceQuestion.questionId,
          );
          if (sourceRound && !alreadySaved) {
            if (!session.interviewId.performance) {
              session.interviewId.performance = {};
            }
            if (!session.interviewId.performance.categoryScores) {
              session.interviewId.performance.categoryScores = {};
            }
            sourceRound.answers.push({
              questionId: sourceQuestion.questionId,
              answer: answer.trim(),
              timeTaken,
              hintsUsed: 0,
              skipped: false,
              evaluation: {
                score: evaluation.overallScore || 0,
                feedback: evaluation.feedback || "",
                strengths: evaluation.strengths || [],
                improvements: evaluation.improvements || [],
                technicalAccuracy:
                  evaluation.categoryScores?.accuracy || 0,
                clarity: evaluation.categoryScores?.clarity || 0,
                completeness:
                  evaluation.categoryScores?.completeness || 0,
                categoryScores: evaluation.categoryScores || {},
                isComplete: evaluation.isComplete !== false,
                missingPoints: evaluation.missingPoints || [],
                needsFollowUp: evaluation.needsFollowUp || false,
                weightedScore: evaluation.weightedScore || 0,
                metadata: evaluation.metadata || {},
              },
              timestamp: new Date(),
            });
            const savedAnswers = sourceRound.answers.filter(
              (savedAnswer) => !savedAnswer.skipped && savedAnswer.evaluation,
            );
            const averageScore =
              savedAnswers.reduce(
                (sum, savedAnswer) =>
                  sum + (savedAnswer.evaluation.score || 0),
                0,
              ) / savedAnswers.length;
            session.interviewId.performance.overallScore =
              Math.round(averageScore);
            session.interviewId.performance.questionsAnswered =
              savedAnswers.length;
            session.interviewId.performance.categoryScores.technical =
              Math.round(averageScore);
            session.interviewId.performance.categoryScores.communication =
              Math.round(
                savedAnswers.reduce(
                  (sum, savedAnswer) =>
                    sum +
                    (savedAnswer.evaluation.categoryScores?.clarity || 0),
                  0,
                ) / savedAnswers.length,
              );
            session.interviewId.performance.categoryScores.problemSolving =
              Math.round(
                savedAnswers.reduce(
                  (sum, savedAnswer) =>
                    sum +
                    (savedAnswer.evaluation.categoryScores?.completeness || 0),
                  0,
                ) / savedAnswers.length,
              );
            await session.interviewId.save();
          }

          await session.save();
          acknowledge?.({ success: true });
          socket.emit("performance-update", getPerformanceStats(sessionId));

          const sessionKey = session._id.toString();
          let sessionData =
            activeSessions.get(sessionKey) || activeSessions.get(sessionId);
          if (!sessionData) {
            const plan = getQuestionPlan(session.interviewId);
            const askedQuestions = (session.conversation || []).filter(
              (message) => message.type === "question",
            );
            sessionData = {
              plan,
              questionsAsked: askedQuestions.length,
              categoryCounts: {
                technical: evaluations.filter(
                  (item) => item.category === "technical",
                ).length,
                behavioral: evaluations.filter(
                  (item) => item.category === "behavioral",
                ).length,
                coding: evaluations.filter(
                  (item) => item.category === "coding",
                ).length,
                "system-design": evaluations.filter(
                  (item) => item.category === "system-design",
                ).length,
              },
            };
          }

          const plan = getQuestionPlan(session.interviewId);
          sessionData.plan = plan;
          sessionData.questionsAsked = Math.max(
            sessionData.questionsAsked,
            (session.conversation || []).filter(
              (message) => message.type === "question",
            ).length,
          );
          activeSessions.set(sessionKey, sessionData);

          if ((session.questionEvaluations || []).length < plan.totalQuestions) {
            await askNextQuestion(socket, session, session.interviewId, io);
          } else {
            await completeInterview(
              socket,
              session,
              session.interviewId,
              io,
            );
          }
        } catch (error) {
          console.error("❌ Answer processing error:", error);
          acknowledge?.({
            success: false,
            message: "Failed to process answer",
          });
          socket.emit("error", {
            message: "Failed to process answer",
            details: error.message,
          });
        }
      },
    );

    // =====================================
    // CODE SUBMISSION
    // =====================================
    socket.on(
      "submit-code",
      async ({ sessionId, question, code, language }, acknowledge) => {
        try {
          if (pausedSessions.has(sessionId)) {
            acknowledge?.({
              success: false,
              message: "Resume the interview before submitting your solution.",
            });
            return;
          }

          console.log("💻 Code submission received");

          const session =
            await InterviewSession.findById(sessionId).populate("interviewId");
          if (!session) {
            socket.emit("error", { message: "Session not found" });
            acknowledge?.({ success: false, message: "Session not found" });
            return;
          }

          socket.emit("ai-status", {
            status: "processing",
            message: "Reviewing your code...",
          });

          const details = getInterviewDetails(session.interviewId);
          const context = `Role: ${details.role}, Language: ${language}`;
          const questionIndex = session.questionEvaluations.length;
          const questionTimerKey = `${sessionId}-${questionIndex}`;
          const questionTimer = questionTimers.get(questionTimerKey);
          questionTimers.delete(questionTimerKey);
          const timeSpent = questionTimer
            ? Math.floor((Date.now() - questionTimer) / 1000)
            : 0;

          let evaluation;
          try {
            evaluation = await evaluateAnswer(
              question,
              `Code implementation in ${language}:\n\n${code}`,
              context,
              code,
            );
          } catch (error) {
            evaluation = getFallbackCodeEvaluation(code, language);
          }

          session.questionEvaluations.push({
            questionNumber: questionIndex + 1,
            question: question,
            userAnswer: `Code in ${language}`,
            score: evaluation.score,
            feedback: evaluation.review,
            category: "coding",
            difficulty: details.difficulty,
            codeSubmitted: code,
            timeSpent,
            strengths: evaluation.strength ? [evaluation.strength] : [],
            improvements: evaluation.improvement
              ? [evaluation.improvement]
              : [],
            timestamp: new Date(),
          });

          await session.save();
          acknowledge?.({ success: true });

          updatePerformanceMetrics(sessionId, {
            score: evaluation.score,
            category: "coding",
          });

          socket.emit("performance-update", getPerformanceStats(sessionId));

          const sessionData = activeSessions.get(sessionId);
          const shouldContinue =
            sessionData &&
            sessionData.questionsAsked < sessionData.plan.totalQuestions;

          setTimeout(async () => {
            if (shouldContinue) {
              await askNextQuestion(socket, session, session.interviewId, io);
            } else {
              await completeInterview(
                socket,
                session,
                session.interviewId,
                io,
              );
            }
          }, 800);
        } catch (error) {
          console.error("❌ Code submission error:", error);
          acknowledge?.({
            success: false,
            message: "Failed to process code",
          });
          socket.emit("error", { message: "Failed to process code" });
        }
      },
    );

    // =====================================
    // END INTERVIEW
    // =====================================
    socket.on("end-interview", async ({ sessionId, interviewId }, acknowledge) => {
      try {
        const session = await InterviewSession.findById(sessionId);
        const interview = await Interview.findById(interviewId);

        if (!session || !interview) {
          socket.emit("error", { message: "Session or interview not found" });
          acknowledge?.({
            success: false,
            message: "Session or interview not found",
          });
          return;
        }

        const completed = await completeInterview(socket, session, interview, io);
        acknowledge?.({
          success: completed,
          message: completed ? undefined : "Failed to complete interview",
        });
      } catch (error) {
        console.error("❌ End interview error:", error);
        acknowledge?.({ success: false, message: "Failed to end interview" });
        socket.emit("error", { message: "Failed to end interview" });
      }
    });

    // =====================================
    // DISCONNECT
    // =====================================
    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      
      // Find and clean up session associated with this socket
      const sessionId = socketToSession.get(socket.id);
      
      if (sessionId) {
        // Clear any pending timers
        clearQuestionTimers(sessionId);
        
        // Remove session data from memory
        activeSessions.delete(sessionId);
        performanceCache.delete(sessionId);
        socketToSession.delete(socket.id);
        
        console.log(`✅ Cleaned up session ${sessionId} for disconnected client`);
      }
    });
  });
};
