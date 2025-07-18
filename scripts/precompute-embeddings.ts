import { CohereClient, Cohere } from 'cohere-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Adjust the path to your JSON file as needed
const talentProfilesPath = path.join(process.cwd(), 'dataset/Talent Profiles.json');
const outputPath = path.join(process.cwd(), 'app/api/matching/talent_embeddings.json');

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

interface Talent {
  id: string;
  name: string;
  city: string;
  categories: string[];
  skills: string[];
  style_tags: string[];
  description?: string; // Make description optional as it's not in the provided data
}

async function createEmbeddings() {
  console.log('Reading talent profiles...');
  const talentProfiles: Talent[] = JSON.parse(fs.readFileSync(talentProfilesPath, 'utf-8'));

  const textsToEmbed = talentProfiles.map(p => {
    // Create a descriptive text for each talent for better embedding results
    return `Name: ${p.name}. City: ${p.city}. Categories: ${p.categories.join(', ')}. Skills: ${p.skills.join(', ')}. Styles: ${p.style_tags.join(', ')}`;
  });

  console.log(`Embedding ${textsToEmbed.length} talent profiles...`);

  const embeddings: number[][] = [];
  const batchSize = 96; // Cohere's API limit

  for (let i = 0; i < textsToEmbed.length; i += batchSize) {
    const batch = textsToEmbed.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1}...`);
    const response = await cohere.embed({
      texts: batch,
      model: 'embed-english-v3.0',
      inputType: 'search_document'
    });
    if (Array.isArray(response.embeddings)) {
      embeddings.push(...response.embeddings);
    }
    // A small delay to be safe with rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const talentEmbeddings = talentProfiles.map((talent, i) => ({
    id: talent.id,
    embedding: embeddings[i],
  }));

  console.log('Saving embeddings to file...');
  fs.writeFileSync(outputPath, JSON.stringify(talentEmbeddings, null, 2));

  console.log('Embeddings created successfully!');
}

createEmbeddings();
