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
    const { word, turkishMeaning, englishMeaning, article, pluralForm, partOfSpeech } = await req.json();
    
    if (!word) {
      return new Response(JSON.stringify({ error: 'Word data is required' }), {
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

    const prompt = `Generate exactly 10 practice questions for the German word "${word}" (${partOfSpeech}).
Word info:
- Turkish meaning: ${turkishMeaning}
- English meaning: ${englishMeaning}
- Article: ${article || 'N/A'}
- Plural: ${pluralForm || 'N/A'}

Create a mix of question types:
1. Multiple choice (4 options, 1 correct)
2. Fill in the blank
3. Meaning selection
4. Sentence completion

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    },
    {
      "id": 2,
      "type": "fill_blank",
      "question": "Complete: Ich ___ gern Bücher.",
      "correctAnswer": "lese",
      "hint": "to read"
    },
    {
      "id": 3,
      "type": "meaning_selection",
      "question": "What does 'Buch' mean?",
      "options": ["Book", "Table", "Chair", "Window"],
      "correctAnswer": 0
    },
    {
      "id": 4,
      "type": "sentence_completion",
      "question": "Choose the correct word: Der ___ ist groß.",
      "options": ["Hund", "Katze", "Maus", "Vogel"],
      "correctAnswer": 0
    }
  ]
}

Make questions progressively harder. Include article questions if it's a noun.
IMPORTANT: Return ONLY valid JSON, no additional text.`;

    console.log('Generating practice questions for:', word);

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
      return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content;
    
    if (!textContent) {
      console.error('No content in AI response');
      return new Response(JSON.stringify({ error: 'Invalid response from AI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clean the response
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

    const questionsData = JSON.parse(cleanedContent);
    console.log('Generated', questionsData.questions?.length, 'questions');

    return new Response(JSON.stringify(questionsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-practice:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
