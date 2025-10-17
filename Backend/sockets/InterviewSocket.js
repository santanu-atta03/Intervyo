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
        console.log('Sending AI message:', data.type, '| Text:', data.message.substring(0, 50));
        
        // Generate speech audio buffer for the message text
        const audioBuffer = await textToSpeech(data.message);

        let payload;
        
        if (audioBuffer) {
          // Convert audio buffer to base64 string to send over socket
          const audioBase64 = audioBuffer.toString('base64');
          
          payload = { 
            ...data, 
            audioBase64,
            hasAudio: true 
          };
          console.log('Audio generated successfully, size:', audioBase64.length);
        } else {
          // Fallback without audio
          payload = { 
            ...data, 
            hasAudio: false,
            useFallbackTTS: true // Signal client to use browser TTS
          };
          console.log('Using fallback TTS');
        }

        // Send message
        if (toSocket) {
          toSocket.emit('ai-message', payload);
        } else {
          io.to(roomId).emit('ai-message', payload);
        }
        
        console.log('AI message sent successfully');
      } catch (error) {
        console.error('Error in sendAIMessage:', error);
        // Send message without audio as fallback
        const payload = { 
          ...data, 
          hasAudio: false,
          useFallbackTTS: true,
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

        // Don't send greeting here - wait for candidate-ready
        console.log('Room joined successfully, waiting for candidate-ready signal');
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Candidate ready: send greeting and first question
    socket.on('candidate-ready', async ({ sessionId, interviewId }) => {
      try {
        console.log('Candidate ready event received:', { sessionId, interviewId });

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

        console.log('Sending greeting message...');
        
        // Send greeting with proper delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await sendAIMessage(socket.id, {
          type: 'greeting',
          message: `Hello! Welcome to your ${interview.role} interview. I'm your AI interviewer today, and I'm excited to learn more about you. Let's have a great conversation!`,
          timestamp: new Date()
        }, socket);

        // Wait for greeting to complete before sending question
        await new Promise(resolve => setTimeout(resolve, 6000));

        console.log('Sending first question...');
        
        await sendAIMessage(socket.id, {
          type: 'question',
          message: "Let's start with a brief introduction. Could you tell me about your background and what interests you about this role?",
          questionIndex: 0,
          requiresCode: false,
          timestamp: new Date()
        }, socket);

      } catch (error) {
        console.error('Candidate ready error:', error);
        socket.emit('error', { message: 'Failed to start interview' });
      }
    });

    // Candidate answer
    socket.on('candidate-answer', async ({ sessionId, question, answer, questionIndex }) => {
      try {
        console.log('Received answer:', { questionIndex, answerLength: answer.length });

        const session = await InterviewSession.findById(sessionId).populate('interviewId');

        if (!session) {
          socket.emit('error', { message: 'Session not found' });
          return;
        }

        // Send processing status
        socket.emit('ai-status', { 
          status: 'processing', 
          message: 'Thank you! Let me review your response...' 
        });

        const context = `Role: ${session.interviewId.role}, Difficulty: ${session.interviewId.difficulty}`;
        
        console.log('Evaluating answer...');
        const evaluation = await evaluateAnswer(question, answer, context);
        console.log('Evaluation complete:', evaluation);

        // Save to session
        session.conversation.push({
          question,
          answer,
          aiReview: evaluation.review,
          score: evaluation.score
        });
        session.currentQuestionIndex += 1;
        await session.save();

        // Wait before sending review
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Sending review...');
        await sendAIMessage(socket.id, {
          type: 'review',
          message: evaluation.review,
          score: evaluation.score,
          strength: evaluation.strength,
          improvement: evaluation.improvement,
          timestamp: new Date()
        }, socket);

        // Wait for review to complete
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Generate and send next question
        console.log('Generating next question...');
        const nextQ = await generateNextQuestion(
          session.conversation,
          session.interviewId.role,
          session.interviewId.difficulty
        );

        console.log('Sending next question...');
        await sendAIMessage(socket.id, {
          type: 'question',
          message: nextQ.question,
          questionType: nextQ.type,
          questionIndex: session.currentQuestionIndex,
          requiresCode: nextQ.requiresCode || false,
          timestamp: new Date()
        }, socket);

      } catch (error) {
        console.error('Answer processing error:', error);
        socket.emit('error', { message: 'Failed to process answer. Please try again.' });
      }
    });

    // Code submission
    socket.on('submit-code', async ({ sessionId, question, code, language }) => {
      try {
        console.log('Code submission received:', { language, codeLength: code.length });

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

        // Wait before sending review
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send code review
        await sendAIMessage(socket.id, {
          type: 'code-review',
          message: evaluation.review,
          score: evaluation.score,
          strength: evaluation.strength,
          improvement: evaluation.improvement,
          timestamp: new Date()
        }, socket);

      } catch (error) {
        console.error('Code submission error:', error);
        socket.emit('error', { message: 'Failed to process code' });
      }
    });

    // End interview
    socket.on('end-interview', async ({ sessionId, interviewId }) => {
      try {
        console.log('Ending interview:', { sessionId, interviewId });

        await sendAIMessage(socket.id, {
          type: 'closing',
          message: "Thank you so much for your time today. You did great! I'll now prepare your detailed feedback report. This will just take a moment.",
          timestamp: new Date()
        }, socket);

        // Wait for closing message to complete
        await new Promise(resolve => setTimeout(resolve, 5000));

        socket.emit('interview-ended', { sessionId, interviewId });
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