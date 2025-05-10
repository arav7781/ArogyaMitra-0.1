import { SpeechClient } from '@google-cloud/speech';
import multer from 'multer';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

// Configure Google Cloud credentials
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'C:\\Users\\aravs\\Desktop\\LivekitAINurse\\app\\backend1\\arogyamitra-456705-5492cd4dfddf.json';
if (!fs.existsSync(credentialsPath)) {
  console.error(`Credentials file not found at ${credentialsPath}`);
  throw new Error('Google Cloud credentials file not found');
}
process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit
const speechClient = new SpeechClient();

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Handle file upload
    await promisify(upload.single('audio'))(req, res);
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const audio = req.file.buffer;
    const language = req.body.language || 'en-US';

    // Validate audio buffer
    if (!audio || audio.length === 0) {
      return res.status(400).json({ error: 'Empty audio file' });
    }

    // Configure the request for Speech-to-Text
    const request = {
      audio: { content: audio.toString('base64') },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: language,
        enableAutomaticPunctuation: true,
      },
    };

    // Perform transcription
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n') || '';

    if (!transcription) {
      return res.status(200).json({ transcript: '' }); // Handle empty transcription gracefully
    }

    res.status(200).json({ transcript: transcription });
  } catch (error) {
    console.error('Transcription error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
    });
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle multer
  },
};