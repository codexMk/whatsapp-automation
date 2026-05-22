"use client";

import { useEffect, useState } from "react";
import { useCategoryOrNull } from "@/lib/category-hooks";

interface ReadyMadeTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
}

export default function ReadyMadeTemplatesSection() {
  const category = useCategoryOrNull();
  const [templates, setTemplates] = useState<ReadyMadeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<ReadyMadeTemplate | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setLoading(true);
        if (!category) {
          setLoading(false);
          return;
        }

        const query = new URLSearchParams({ category });
        const response = await fetch(`/api/templates/ready-made?${query}`);

        if (!response.ok) {
          console.error("Failed to fetch ready-made templates");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (error) {
        console.error("Error loading ready-made templates:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
  }, [category]);

  const handleUseTemplate = async (templateId: string) => {
    try {
      setCopying(templateId);
      const response = await fetch("/api/templates/ready-made", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      if (!response.ok) {
        throw new Error("Failed to copy template");
      }

      const data = await response.json();
      setMessage("✓ Template copied to your library!");

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error copying template:", error);
      setMessage("✗ Failed to copy template");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setCopying(null);
    }
  };

  const extractVariables = (content: string): string[] => {
    const pattern = /\{\{(\w+)\}\}/g;
    const matches = content.match(pattern) || [];
    const variables = matches.map((match) => match.replace(/\{\{|\}\}/g, ""));
    return [...new Set(variables)];
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
        <div className="text-center text-slate-600">Loading templates...</div>
      </div>
    );
  }

  if (templates.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900">Ready-Made Templates ⚡</h2>
        <p className="text-slate-600 mt-2">
          Start with professional templates designed for {category}s. Copy any template to customize it.
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className={`border-l-4 p-4 rounded-lg ${
          message.includes("✓") 
            ? "bg-green-50 border-green-500" 
            : "bg-red-50 border-red-500"
        }`}>
          <p className={`font-semibold ${message.includes("✓") ? "text-green-800" : "text-red-800"}`}>
            {message}
          </p>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col"
          >
            {/* Title */}
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              {template.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-4">
              {template.description}
            </p>

            {/* Content Preview */}
            <div className="bg-slate-50 p-4 rounded-lg mb-4 max-h-24 overflow-hidden flex-grow">
              <p className="text-xs text-slate-700 line-clamp-4">
                {template.content}
              </p>
            </div>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewTemplate(template)}
                className="flex-1 border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Preview
              </button>
              <button
                onClick={() => handleUseTemplate(template.id)}
                disabled={copying === template.id}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                {copying === template.id ? "Copying..." : "Use Template"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Each template includes smart placeholders like name, date, time, amount, business 
          that you can customize when creating campaigns.
        </p>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{previewTemplate.title}</h2>
                <p className="text-blue-100 text-sm mt-1">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-white text-2xl hover:bg-blue-800 rounded-lg p-1 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Full Content */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">📝 Template Content</h3>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-slate-900 leading-relaxed whitespace-pre-wrap font-mono text-sm border-l-4 border-l-blue-500">
                  {previewTemplate.content}
                </div>
              </div>

              {/* Variables */}
              {extractVariables(previewTemplate.content).length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">🔤 Smart Placeholders</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {extractVariables(previewTemplate.content).map((variable) => (
                      <div key={variable} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <code className="text-blue-900 font-semibold text-sm">
                          {"{{"}{variable}{"}"}
                        </code>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-3">
                    These placeholders will be replaced with actual values when sending the message.
                  </p>
                </div>
              )}

              {/* Tags */}
              {previewTemplate.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">🏷️ Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold py-2 px-4 rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleUseTemplate(previewTemplate.id);
                  setPreviewTemplate(null);
                }}
                disabled={copying === previewTemplate.id}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {copying === previewTemplate.id ? "Copying..." : "Use This Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
