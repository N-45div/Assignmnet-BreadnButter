import { NextRequest, NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';
import { Talent } from './types';
import talentEmbeddings from './talent_embeddings.json';
import fs from 'fs';
import path from 'path';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Read the talent profiles data from the file system
const talentProfilesPath = path.join(process.cwd(), 'dataset/Talent Profiles.json');
const talentProfilesData: Talent[] = JSON.parse(fs.readFileSync(talentProfilesPath, 'utf-8'));

const talentMap = new Map(talentProfilesData.map((t: Talent) => [t.id, t]));

interface TalentEmbedding {
  id: string;
  embedding: number[];
}

// Rule-based scoring function
function calculateRuleBasedScore(brief: string, talent: Talent): number {
  let score = 0;

  // Location match (simple keyword check)
  if (brief.toLowerCase().includes(talent.city.toLowerCase())) {
    score += 2; // Example score
  }

  // Category overlap
  const briefCategories = ['photographer', 'director', 'editor', 'designer', 'stylist', 'videographer', 'animator']; // Example categories
  briefCategories.forEach(cat => {
    if (brief.toLowerCase().includes(cat.toLowerCase())) {
      if (talent.categories.some(tCat => tCat.toLowerCase() === cat.toLowerCase())) {
        score += 3; // Example score
      }
    }
  });

  // Skill overlap
  const briefSkills = ['candid portraits', 'pastel tones', 'fashion shoots', 'corporate shoots', 'weddings', 'documentaries', 'social media', 'branding']; // Example skills
  briefSkills.forEach(skill => {
    if (brief.toLowerCase().includes(skill.toLowerCase())) {
      if (talent.skills.some(tSkill => tSkill.toLowerCase() === skill.toLowerCase())) {
        score += 2; // Example score
      }
    }
  });

  // Budget range (simple check for now, can be more sophisticated)
  const budgetMatch = brief.match(/\u20b9(\d+k|\d+)/i); // Matches ₹75k or ₹75000
  if (budgetMatch) {
    let briefBudget = parseFloat(budgetMatch[1].replace('k', '000'));
    const talentBudgetRange = talent.budget_range.match(/\u20b9(\d+)\u2013\u20b9(\d+)/);
    if (talentBudgetRange) {
      const minBudget = parseFloat(talentBudgetRange[1]);
      const maxBudget = parseFloat(talentBudgetRange[2]);
      if (briefBudget >= minBudget && briefBudget <= maxBudget) {
        score += 5; // Example score
      }
    }
  }

  return score;
}

export async function POST(req: NextRequest) {
  const { brief } = await req.json();

  if (!brief) {
    return NextResponse.json({ error: 'Brief is required' }, { status: 400 });
  }

  try {
    const briefEmbeddingResponse = await cohere.embed({
      texts: [brief],
      model: 'embed-english-v3.0',
      inputType: 'search_query'
    });

    if (!briefEmbeddingResponse.embeddings || briefEmbeddingResponse.embeddings.length === 0) {
        return NextResponse.json({ error: 'Could not generate embedding for the brief' }, { status: 500 });
    }
    const briefEmbedding = briefEmbeddingResponse.embeddings[0];

    const combinedScores = (talentEmbeddings as TalentEmbedding[]).map(talentEmbedding => {
      const talent = talentMap.get(talentEmbedding.id);
      if (!talent) return { id: talentEmbedding.id, score: 0 };

      const semanticScore = cosineSimilarity(briefEmbedding, talentEmbedding.embedding);
      const ruleBasedScore = calculateRuleBasedScore(brief, talent);

      // Combine scores (example weighting)
      const finalScore = (semanticScore * 10) + ruleBasedScore; // Adjust weights as needed

      return {
        id: talentEmbedding.id,
        score: finalScore,
      };
    });

    const rankedTalent = combinedScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => {
        const talent = talentMap.get(s.id);
        if (talent) {
          return { ...talent, score: s.score };
        }
        return null;
      })
      .filter(Boolean);

    return NextResponse.json(rankedTalent);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) {
    return 0;
  }
  const dotProduct = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  return dotProduct / (magnitudeA * magnitudeB);
}
