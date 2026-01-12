// services/websocket.service.js
const socketIO = require('socket.io');

class WebSocketService {
  
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'https://intervyo-sage.vercel.app',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join interview room
      socket.on('join-interview', (data) => {
        const { interviewId, userId } = data;
        socket.join(interviewId);
        this.connectedUsers.set(socket.id, { interviewId, userId });
        console.log(`User ${userId} joined interview ${interviewId}`);
      });

      // Real-time emotion updates
      socket.on('emotion-update', (data) => {
        const { interviewId, emotions, confidence } = data;
        this.io.to(interviewId).emit('emotion-data', {
          emotions,
          confidence,
          timestamp: Date.now()
        });
      });

      // Speech metrics updates
      socket.on('speech-update', (data) => {
        const { interviewId, metrics } = data;
        this.io.to(interviewId).emit('speech-metrics', {
          metrics,
          timestamp: Date.now()
        });
      });

      // Timer updates
      socket.on('timer-update', (data) => {
        const { interviewId, timeRemaining } = data;
        this.io.to(interviewId).emit('timer-sync', {
          timeRemaining,
          timestamp: Date.now()
        });
      });

      // Disconnect
      socket.on('disconnect', () => {
        const userData = this.connectedUsers.get(socket.id);
        if (userData) {
          console.log(`User ${userData.userId} disconnected from interview ${userData.interviewId}`);
          this.connectedUsers.delete(socket.id);
        }
      });
    });
  }

  // Emit AI interviewer speech
  emitAISpeech(interviewId, data) {
    this.io.to(interviewId).emit('ai-speaking', {
      text: data.text,
      audioUrl: data.audioUrl,
      duration: data.duration,
      timestamp: Date.now()
    });
  }

  // Emit question transition
  emitQuestionChange(interviewId, question) {
    this.io.to(interviewId).emit('new-question', {
      question,
      timestamp: Date.now()
    });
  }

  // Emit evaluation feedback
  emitEvaluation(interviewId, evaluation) {
    this.io.to(interviewId).emit('answer-evaluated', {
      evaluation,
      timestamp: Date.now()
    });
  }
}

module.exports = new WebSocketService();