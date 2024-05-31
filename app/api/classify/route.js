import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // Ensure this is set in your .env.local file
});

export async function POST(req) {
  try {
    const { inputs, examples } = await req.json();
    console.log('Received inputs:', inputs);
    console.log('Received examples:', examples);

    // Ensure inputs and examples are in the correct format
    if (!Array.isArray(inputs) || !Array.isArray(examples)) {
      throw new Error('Invalid data format: inputs and examples should be arrays');
    }

    // Check each example object
    examples.forEach(example => {
      if (typeof example.text !== 'string' || typeof example.label !== 'string') {
        throw new Error('Invalid example format: each example should have text and label properties as strings');
      }
    });

    // Limit inputs to the first 50 sentences
    const limitedInputs = inputs.slice(0, 50);

    const response = await cohere.classify({
      model: 'embed-english-v2.0',
      inputs: limitedInputs,
      examples,
    });

    console.log('Cohere response:', response.classifications);
    return NextResponse.json(response.classifications.map(classification => ({
      text: classification.input,
      prediction: classification.prediction,
      confidences: classification.confidences
    })));
  } catch (error) {
    console.error('Error in classification:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
