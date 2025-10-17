import axios from 'axios';
import fs from 'fs';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_monolingual_v1';

// Text to Speech using ElevenLabs
export const textToSpeech = async (text) => {
  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      data: {
        text: text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      },
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error.response?.data || error.message);
    throw error;
  }
};

// Stream Text to Speech (Better for real-time)
export const textToSpeechStream = async (text, outputPath) => {
  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      data: {
        text: text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      },
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(outputPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('ElevenLabs Stream Error:', error.response?.data || error.message);
    throw error;
  }
};

// Get available voices (for reference)
export const getAvailableVoices = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.elevenlabs.io/v1/voices',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    return response.data.voices;
  } catch (error) {
    console.error('Get voices error:', error);
    throw error;
  }
};

// Check remaining quota
export const getQuota = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.elevenlabs.io/v1/user/subscription',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    return {
      characterCount: response.data.character_count,
      characterLimit: response.data.character_limit,
      remaining: response.data.character_limit - response.data.character_count,
    };
  } catch (error) {
    console.error('Get quota error:', error);
    return null;
  }
};

export { VOICE_ID, MODEL_ID };
