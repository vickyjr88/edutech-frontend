import type { ContentSection as ContentSectionType } from "../types";

interface ContentSectionProps {
  section: ContentSectionType;
  index: number;
}

export const ContentSection = ({ section, index }: ContentSectionProps) => {
  const bgClass = index % 2 === 0 ? "bg-white" : "bg-gray-50";

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {section.title}
          </h2>
          {section.content && (
            <div className="prose prose-lg max-w-none text-gray-700">
              {section.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
