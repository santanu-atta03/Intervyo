import controller from '../controllers/EmotionAnalysis.controller.js';
console.log('Imported controller:', typeof controller.storeEmotionMetrics === 'function' ? 'OK' : 'Missing');
