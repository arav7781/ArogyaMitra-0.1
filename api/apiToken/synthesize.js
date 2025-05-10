import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const textToSpeechClient = new TextToSpeechClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, language } = req.body;

    const request = {
      input: { text },
      voice: { languageCode: language, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.status(200).send(audioContent);
  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({ error: 'Synthesis failed' });
  }
}