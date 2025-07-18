import { Talent } from '../../api/matching/types';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TalentDetailPageProps {
  params: { id: string };
}

// Read the talent profiles data from the file system
const talentProfilesPath = path.join(process.cwd(), 'dataset/Talent Profiles.json');
const talentProfilesData: Talent[] = JSON.parse(fs.readFileSync(talentProfilesPath, 'utf-8'));

const talentMap = new Map(talentProfilesData.map((t: Talent) => [t.id, t]));

export default async function TalentDetailPage({ params }: TalentDetailPageProps) {
  const { id } = params;
  const talent = talentMap.get(id);

  if (!talent) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <main className="flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8">
          {talent.name}
        </h1>

        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
            <p className="text-gray-600 dark:text-gray-300">{talent.city}</p>
            <p className="mt-2 text-gray-700 dark:text-gray-200">Experience: {talent.experience_years} years</p>
            <p className="text-gray-700 dark:text-gray-200">Budget Range: {talent.budget_range}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {talent.categories.map((category) => (
                <span key={category} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {talent.skills.map((skill) => (
                <span key={skill} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Style Tags</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {talent.style_tags.map((tag) => (
                <span key={tag} className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {talent.portfolio && talent.portfolio.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {talent.portfolio.map((item, index) => (
                  <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Tags: {item.tags.join(', ')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Keywords: {item.keywords.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add more sections for other talent data as needed */}

          <div className="mt-8 text-center">
            <Link href="/matching">
              <Button>Back to Matching</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
