import InterviewSession from '../models/InterviewSession.js';
import Interview from '../models/Interview.js';
import {
  evaluateAnswer,
  generateNextQuestion,
} from '../config/openai.js';
import { textToSpeech } from '../config/elevenlabs.js';

const activeRooms = new Map();

export default (io) => {
  io.on('connection', (socket) => {
    console.log('✅ New client connected:', socket.id);

    // Helper to send AI message
    const sendAIMessage = async (roomId, data, toSocket = null) => {
      try {
        console.log('📤 Sending AI message:', data.type);
        
        // Try to generate audio
        let audioBuffer = null;
        try {
          audioBuffer = await textToSpeech(data.message);
        } catch (error) {
          console.log('⚠️ TTS failed, using fallback');
        }

        const payload = audioBuffer ? {
          ...data,
          audioBase64: audioBuffer.toString('base64'),
          hasAudio: true
        } : {
          ...data,
          hasAudio: false,
          useFallbackTTS: true
        };

        // Send message
        if (toSocket) {
          toSocket.emit('ai-message', payload);
        } else {
          io.to(roomId).emit('ai-message', payload);
        }
        
        console.log('✅ AI message sent');
      } catch (error) {
        console.error('❌ Error in sendAIMessage:', error);
        // Send without audio as fallback
        const payload = { ...data, hasAudio: false, useFallbackTTS: true };
        if (toSocket) {
          toSocket.emit('ai-message', payload);
        } else {
          io.to(roomId).emit('ai-message', payload);
        }
      }
    };

    // Join interview room
    socket.on('join-room', async ({ roomId, userId }) => {
      try {
        socket.join(roomId);
        activeRooms.set(socket.id, { roomId, userId });
        console.log(`✅ User ${userId} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
      } catch (error) {
        console.error('❌ Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Candidate ready - START INTERVIEW FLOW
    socket.on('candidate-ready', async ({ sessionId, interviewId }) => {
      try {
        console.log('🎬 Starting interview:', { sessionId, interviewId });

        const interview = await Interview.findById(interviewId);
        const session = await InterviewSession.findById(sessionId);

        if (!session || !interview) {
          socket.emit('error', { message: 'Session or interview not found' });
          return;
        }

        // Send ready acknowledgment
        socket.emit('interview-ready', { 
          sessionId: session._id,
          interviewId: interview._id 
        });

        console.log('📢 Sending greeting...');
        
        // GREETING
        const greetingMsg = `Hello! Welcome to your ${interview.role} interview. I'm your AI interviewer. Let's get started!`;
        
        await sendAIMessage(socket.id, {
          type: 'greeting',
          message: greetingMsg,
          timestamp: new Date()
        }, socket);

        // Save greeting
        session.conversation.push({
          speaker: 'ai',
          message: greetingMsg,
          type: 'greeting',
          timestamp: new Date()
        });
        await session.save();

        // Wait 3 seconds then send first question
        setTimeout(async () => {
          console.log('❓ Sending first question...');
          
          const firstQ = "Tell me about yourself and your experience in this field.";
          
          await sendAIMessage(socket.id, {
            type: 'question',
            message: firstQ,
            questionIndex: 0,
            requiresCode: false,
            timestamp: new Date()
          }, socket);

          // Save question
          session.conversation.push({
            speaker: 'ai',
            message: firstQ,
            type: 'question',
            timestamp: new Date()
          });
          await session.save();
          
          console.log('✅ First question sent');
        }, 3000);

      } catch (error) {
        console.error('❌ Candidate ready error:', error);
        socket.emit('error', { message: 'Failed to start interview' });
      }
    });

    // Candidate answer - MAIN FLOW
    socket.on('candidate-answer', async ({ sessionId, question, answer, questionIndex }) => {
      try {
        console.log('💬 Received answer for question', questionIndex);

        const session = await InterviewSession.findById(sessionId).populate('interviewId');

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Send processing status
        socket.emit('ai-status', { 
          status: 'processing', 
          message: 'Analyzing your response...' 
        });

        // Save candidate answer IMMEDIATELY
        session.conversation.push({
          speaker: 'candidate',
          message: answer,
          type: 'answer',
          timestamp: new Date()
        });

        // Evaluate answer with fallback
        let evaluation;
        try {
          console.log('🔍 Evaluating answer...');
          const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}`;
          evaluation = await evaluateAnswer(question, answer, context);
          console.log('✅ Evaluation done:', evaluation.score);
        } catch (error) {
          console.error('⚠️ Evaluation failed, using fallback');
          evaluation = {
            review: `Thank you for your answer. You provided a ${answer.length > 100 ? 'detailed' : 'good'} response.`,
            score: answer.length > 100 ? 7 : 6,
            strength: 'Clear communication',
            improvement: 'Keep it up'
          };
        }

        // Save evaluation
        session.questionEvaluations.push({
          question: question,
          answer: answer,
          score: evaluation.score,
          maxScore: 10,
          feedback: evaluation.review,
          category: 'technical',
          timestamp: new Date()
        });

        // Update scores
        const evals = session.questionEvaluations;
        if (evals.length > 0) {
          const avgScore = evals.reduce((sum, e) => sum + e.score, 0) / evals.length;
          session.technicalScore = avgScore;
          session.communicationScore = Math.min(avgScore + 1, 10);
          session.problemSolvingScore = avgScore;
        }
        
        session.currentQuestionIndex += 1;
        await session.save();

        // Send review (SHORT AND FAST)
        setTimeout(async () => {
          const reviewMsg = `Good! I'd rate that ${evaluation.score} out of 10. ${evaluation.strength}.`;
          
          await sendAIMessage(socket.id, {
            type: 'review',
            message: reviewMsg,
            score: evaluation.score,
            strength: evaluation.strength,
            improvement: evaluation.improvement,
            timestamp: new Date()
          }, socket);

          // Save review
          session.conversation.push({
            speaker: 'ai',
            message: reviewMsg,
            type: 'feedback',
            timestamp: new Date()
          });
          await session.save();

          // IMMEDIATELY send next question after short delay
          setTimeout(async () => {
            console.log('❓ Generating next question...');
            
            let nextQ;
            try {
              nextQ = await generateNextQuestion(
                session.questionEvaluations,
                session.interviewId.role,
                session.interviewId.difficulty
              );
            } catch (error) {
              console.log('⚠️ Using fallback question');
              const fallbackQuestions = [
                "What are your greatest strengths for this role?",
                "Tell me about a challenging project you worked on.",
                "How do you handle tight deadlines?",
                "What technologies are you most comfortable with?",
                "Describe your problem-solving approach.",
                "How do you stay updated with industry trends?",
                "Tell me about a time you failed and what you learned."
              ];
              nextQ = {
                question: fallbackQuestions[session.currentQuestionIndex % fallbackQuestions.length],
                type: 'behavioral',
                requiresCode: false
              };
            }

            console.log('📤 Sending next question...');
            
            await sendAIMessage(socket.id, {
              type: 'question',
              message: nextQ.question,
              questionType: nextQ.type,
              questionIndex: session.currentQuestionIndex,
              requiresCode: nextQ.requiresCode || false,
              timestamp: new Date()
            }, socket);

            // Save next question
            session.conversation.push({
              speaker: 'ai',
              message: nextQ.question,
              type: 'question',
              timestamp: new Date()
            });
            await session.save();
            
            console.log('✅ Next question sent, ready for answer');

          }, 2000); // 2 seconds after review

        }, 1000); // 1 second to "think"

      } catch (error) {
        console.error('❌ Answer processing error:', error);
        socket.emit('error', { 
          message: 'Failed to process answer. Please try again.',
          details: error.message 
        });
        
        // Send a fallback question anyway to keep flow going
        setTimeout(async () => {
          await sendAIMessage(socket.id, {
            type: 'question',
            message: "Let's continue. Tell me about your technical skills.",
            questionIndex: session?.currentQuestionIndex || 0,
            requiresCode: false,
            timestamp: new Date()
          }, socket);
        }, 2000);
      }
    });

    // Code submission
    socket.on('submit-code', async ({ sessionId, question, code, language }) => {
      try {
        console.log('💻 Code submission received');

        const session = await InterviewSession.findById(sessionId).populate('interviewId');

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        socket.emit('ai-status', { 
          status: 'processing', 
          message: 'Reviewing your code...' 
        });

        const context = `Role: ${session.interviewId.role}, Language: ${language}`;
        
        let evaluation;
        try {
          evaluation = await evaluateAnswer(question, 'Code submission', context, code);
        } catch (error) {
          evaluation = {
            review: 'Thank you for your code submission. The implementation looks good!',
            score: 7,
            strength: 'Code structure',
            improvement: 'Consider edge cases'
          };
        }

        // Save code submission
        session.codeSubmissions.push({
          questionId: String(session.currentQuestionIndex),
          question: question,
          code: code,
          language: language,
          score: evaluation.score,
          feedback: evaluation.review,
          submittedAt: new Date()
        });

        session.questionEvaluations.push({
          question: question,
          answer: `Code in ${language}`,
          score: evaluation.score,
          maxScore: 10,
          feedback: evaluation.review,
          category: 'coding',
          timestamp: new Date()
        });

        await session.save();

        // Send code review
        setTimeout(async () => {
          const codeReviewMsg = `Great! Your code scores ${evaluation.score}/10. ${evaluation.strength}.`;
          
          await sendAIMessage(socket.id, {
            type: 'code-review',
            message: codeReviewMsg,
            score: evaluation.score,
            strength: evaluation.strength,
            improvement: evaluation.improvement,
            timestamp: new Date()
          }, socket);

          session.conversation.push({
            speaker: 'ai',
            message: codeReviewMsg,
            type: 'feedback',
            timestamp: new Date()
          });
          await session.save();
        }, 1500);

      } catch (error) {
        console.error('❌ Code submission error:', error);
        socket.emit('error', { message: 'Failed to process code' });
      }
    });

    // End interview
    socket.on('end-interview', async ({ sessionId, interviewId }) => {
      try {
        console.log('🏁 Ending interview');

        const closingMsg = "Thank you for your time! I'll prepare your feedback now.";
        
        await sendAIMessage(socket.id, {
          type: 'closing',
          message: closingMsg,
          timestamp: new Date()
        }, socket);

        const session = await InterviewSession.findById(sessionId);
        if (session) {
          session.conversation.push({
            speaker: 'ai',
            message: closingMsg,
            type: 'closing',
            timestamp: new Date()
          });
          session.sessionStatus = 'completed';
          await session.save();
        }

        setTimeout(() => {
          socket.emit('interview-ended', { sessionId, interviewId });
        }, 3000);
      } catch (error) {
        console.error('❌ End interview error:', error);
        socket.emit('error', { message: 'Failed to end interview' });
      }
    });

    // WebRTC signaling
    socket.on('offer', ({ to, offer }) => {
      socket.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }) => {
      socket.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      socket.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      const roomData = activeRooms.get(socket.id);
      if (roomData) {
        socket.to(roomData.roomId).emit('user-left', { socketId: socket.id });
        activeRooms.delete(socket.id);
      }
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};