"use client";

import React, { useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Edit3, Eye, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Import a highlight.js theme
import 'highlight.js/styles/github-dark.css';

/**
 * Custom sanitization schema to allow syntax highlighting classes.
 * Without this, rehype-sanitize will strip the 'hljs' classes.
 */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code || []),
      ['className', /^language-./, 'hljs'],
    ],
    span: [
      ['className', /^hljs-./],
    ],
  },
};

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: ProjectPageProps) {
  const { id } = use(params);

  // In a real scenario, you'd fetch this data from your API
  const [description, setDescription] = useState<string>(
    "# Project Scope\n\nThis project requires a **Stellar** integration.\n\n```js\nconsole.log('Deploying to Soroban...');\n```"
  );
  const [isEditing, setIsEditing] = useState(false);

  // Handle empty or undefined cases safely
  const displayDescription = description?.trim() || "_No description provided._";

  return (
    <div className="min-h-screen bg-slate-50 pb-12 pt-8">
      <div className="container mx-auto max-w-5xl px-4">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Project ID</span>
              <h1 className="text-xl font-bold text-slate-900">{id}</h1>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  isEditing ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  !isEditing ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Use Markdown to describe the project..."
                  className="min-h-[400px] w-full rounded-xl border border-slate-200 p-4 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <div className="flex justify-between items-center">
                   <p className="text-xs text-slate-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Supports GitHub Flavored Markdown
                  </p>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none min-h-[400px] rounded-xl border border-slate-50 bg-slate-50/30 p-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, [rehypeSanitize, sanitizeSchema]]}
                >
                  {displayDescription}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}