/**
 * Dynamic Page Component
 * Renders any CMS page dynamically by slug
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { cmsApiService } from "@/services/cms-api.service";
import type { PageContent } from "@/services/cms-api.service";
import { SectionRenderer } from "./SectionRenderer";
import type { CMSSection } from "./types";

interface DynamicPageProps {
  slug?: string; // Optional: can be passed as prop or read from URL params
}

export const DynamicPage = ({ slug: slugProp }: DynamicPageProps) => {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const slug = slugProp || slugParam;

  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("No page slug provided");
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsApiService.getPage(slug);
        setPage(data);
      } catch (err: any) {
        console.error(`Failed to load page: ${slug}`, err);
        setError(err.message || "Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kidato-purple mx-auto mb-4"></div>
            <p className="text-gray-600">Loading page...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "Sorry, we couldn't load this page. It may not exist or there was an error loading it."}
            </p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render page sections
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {page.sections.map((section, index) => (
          <SectionRenderer
            key={index}
            section={section as CMSSection}
            index={index}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default DynamicPage;
