import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { word } = await req.json();
    
    if (!word || typeof word !== 'string') {
      return new Response(JSON.stringify({ error: 'Word is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are a German language expert. Analyze the German word "${word}" and provide the following information in JSON format:

{
  "word": "${word}",
  "turkishMeaning": "Turkish translation",
  "englishMeaning": "English translation",
  "partOfSpeech": "noun/verb/adjective/adverb/etc",
  "article": "der/die/das (only if noun, otherwise null)",
  "pluralForm": "plural form (only if noun, otherwise null)",
  "exampleSentences": [
    {
      "german": "German sentence 1",
      "turkish": "Turkish translation",
      "english": "English translation"
    },
    {
      "german": "German sentence 2",
      "turkish": "Turkish translation",
      "english": "English translation"
    },
    {
      "german": "German sentence 3",
      "turkish": "Turkish translation",
      "english": "English translation"
    },
    {
      "german": "German sentence 4",
      "turkish": "Turkish translation",
      "english": "English translation"
    },
    {
      "german": "German sentence 5",
      "turkish": "Turkish translation",
      "english": "English translation"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON, no additional text or markdown.`;

    console.log('Calling Lovable AI for word:', word);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Lovable AI response received');

    const textContent = data.choices?.[0]?.message?.content;
    if (!textContent) {
      console.error('No content in AI response');
      return new Response(JSON.stringify({ error: 'Invalid response from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = textContent.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const wordData = JSON.parse(cleanedContent);
    console.log('Successfully parsed word data');

    return new Response(JSON.stringify(wordData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-word-lookup:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
