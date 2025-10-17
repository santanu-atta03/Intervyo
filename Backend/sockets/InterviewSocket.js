import InterviewSession from '../models/InterviewSession.js';
import Interview from '../models/Interview.js';
import {
  evaluateAnswer,
  generateNextQuestion,
} from '../config/huggingfaceAi.js';
import { textToSpeech } from '../config/elevenlabs.js';

const activeRooms = new Map();

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Helper to send AI message with TTS audio
    const sendAIMessage = async (roomId, data, toSocket = null) => {
      try {
        console.log('Generating TTS for:', data.message);
        
        // Generate speech audio buffer for the message text
        const audioBuffer = await textToSpeech(data.message);

        // Convert audio buffer to base64 string to send over socket
        const audioBase64 = audioBuffer.toString('base64');

        // Attach audio base64 to data
        const payload = { 
          ...data, 
          audioBase64,
          hasAudio: true 
        };

        console.log('Sending AI message with audio');

        if (toSocket) {
          toSocket.emit('ai-message', payload);
        } else {
          io.to(roomId).emit('ai-message', payload);
        }
      } catch (error) {
        console.error('Error generating TTS audio:', error);
        // Send message without audio as fallback
        const payload = { 
          ...data, 
          hasAudio: false,
          error: 'TTS generation failed' 
        };
        
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

        console.log(`User ${userId} joined room ${roomId}`);

        socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });

        // Send greeting from AI with TTS after a delay
        setTimeout(() => {
          sendAIMessage(roomId, {
            type: 'greeting',
            message: "Hello! I'm your AI interviewer today. I'm excited to learn more about you and your experience. Are you ready to begin?",
            timestamp: new Date()
          }, socket);
        }, 1000);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Candidate ready: send first question with TTS
    socket.on('candidate-ready', async ({ sessionId, interviewId }) => {
      try {
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

        // Send first question after delay
        setTimeout(() => {
          sendAIMessage(socket.id, {
            type: 'question',
            message: "Great! Let's start with a brief introduction. Could you tell me about your background and what interests you about this role?",
            questionIndex: 0,
            requiresCode: false,
            timestamp: new Date()
          }, socket);
        }, 2000);
      } catch (error) {
        console.error('Candidate ready error:', error);
        socket.emit('error', { message: 'Failed to start interview' });
      }
    });

    // Candidate answer
    socket.on('candidate-answer', async ({ sessionId, question, answer, questionIndex }) => {
      try {
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

        const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}`;
        const evaluation = await evaluateAnswer(question, answer, context);

        // Save to session
        session.conversation.push({
          question,
          answer,
          aiReview: evaluation.review,
          score: evaluation.score
        });
        session.currentQuestionIndex += 1;
        await session.save();

        // Send review with TTS
        setTimeout(() => {
          sendAIMessage(socket.id, {
            type: 'review',
            message: evaluation.review,
            score: evaluation.score,
            strength: evaluation.strength,
            improvement: evaluation.improvement,
            timestamp: new Date()
          }, socket);
        }, 1500);

        // Generate and send next question with TTS
        setTimeout(async () => {
          try {
            const nextQ = await generateNextQuestion(
              session.conversation,
              session.interviewId.role,
              session.interviewId.difficulty
            );

            sendAIMessage(socket.id, {
              type: 'question',
              message: nextQ.question,
              questionType: nextQ.type,
              questionIndex: session.currentQuestionIndex,
              requiresCode: nextQ.requiresCode || false,
              timestamp: new Date()
            }, socket);
          } catch (error) {
            console.error('Generate next question error:', error);
            socket.emit('error', { message: 'Failed to generate next question' });
          }
        }, 3000);
      } catch (error) {
        console.error('Answer processing error:', error);
        socket.emit('error', { message: 'Failed to process answer' });
      }
    });

    // Code submission
    socket.on('submit-code', async ({ sessionId, question, code, language }) => {
      try {
        const session = await InterviewSession.findById(sessionId).populate('interviewId');

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        socket.emit('ai-status', { 
          status: 'processing', 
          message: 'Reviewing your code...' 
        });

        const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}, Language: ${language}`;
        const evaluation = await evaluateAnswer(question, 'Code submission', context, code);

        // Update last conversation entry with code
        const lastEntry = session.conversation[session.conversation.length - 1];
        if (lastEntry) {
          lastEntry.codeSubmitted = code;
          lastEntry.language = language;
          lastEntry.aiReview = evaluation.review;
          lastEntry.score = evaluation.score;
          await session.save();
        }

        // Send code review with TTS
        setTimeout(() => {
          sendAIMessage(socket.id, {
            type: 'code-review',
            message: evaluation.review,
            score: evaluation.score,
            strength: evaluation.strength,
            improvement: evaluation.improvement,
            timestamp: new Date()
          }, socket);
        }, 2000);
      } catch (error) {
        console.error('Code submission error:', error);
        socket.emit('error', { message: 'Failed to process code' });
      }
    });

    // End interview
    socket.on('end-interview', async ({ sessionId, interviewId }) => {
      try {
        sendAIMessage(socket.id, {
          type: 'closing',
          message: "Thank you for your time today. I'll now prepare your detailed feedback report. Give me a moment...",
          timestamp: new Date()
        }, socket);

        setTimeout(() => {
          socket.emit('interview-ended', { sessionId, interviewId });
        }, 3000);
      } catch (error) {
        console.error('End interview error:', error);
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
      console.log('Client disconnected:', socket.id);
    });
  });
};