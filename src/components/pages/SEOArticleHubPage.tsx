import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  Share2,
  Tag,
  Phone,
  Search,
} from "lucide-react";
import type { PageRoute, AstrologyArticle } from "../../types";
import { ARTICLES_DATA } from "../../data/articles";
import { updateSEO, injectArticleSchema, injectFaqSchema } from "../../lib/seo";

interface SEOArticleHubPageProps {
  slug?: string;
  onNavigate: (route: PageRoute) => void;
}

export const SEOArticleHubPage: React.FC<SEOArticleHubPageProps> = ({ slug, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const currentArticle = slug ? ARTICLES_DATA.find((a) => a.slug === slug) : null;

  useEffect(() => {
    if (currentArticle) {
      updateSEO({
        title: `${currentArticle.title} — Astroguru`,
        description: currentArticle.excerpt,
        canonicalPath: `/blog/${currentArticle.slug}`,
        type: "article",
        keywords: currentArticle.tags,
      });
      injectArticleSchema(currentArticle);
      injectFaqSchema(currentArticle.faqs);
    } else {
      updateSEO({
        title: "Vedic Astrology Articles, Nakshatra Insights & Shastric Guides — Astroguru",
        description: "Explore in-depth articles on 27 Nakshatras, Sade Sati phases, Raj Yogas, gemstones, and planetary transits written by certified Banaras Sanskrit scholars on Astroguru.",
        canonicalPath: "/blogs",
        keywords: [
          "astrology articles",
          "vedic astrology blog",
          "nakshatra guide",
          "sade sati remedies",
          "gajakesari yoga",
          "gemstones guide",
        ],
      });
    }
  }, [currentArticle, slug]);

  const filteredArticles = ARTICLES_DATA.filter((a) => {
    const matchesCat = selectedCategory === "all" || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // ARTICLE DETAIL VIEW
  if (currentArticle) {
    return (
      <div className="w-full bg-[#fcfaf7] text-[#2c2416] pb-16">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-[#826a48] border-b border-[#ebd7be]">
          <button
            type="button"
            onClick={() => onNavigate({ page: "blogs" })}
            className="flex items-center gap-1 hover:text-[#c8531c] font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to All Articles</span>
          </button>
          <div className="flex items-center gap-2">
            <span>Blog</span>
            <span>/</span>
            <span className="font-semibold text-[#2c2416] truncate max-w-xs">{currentArticle.title}</span>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl border border-[#ebd7be] p-6 sm:p-10 shadow-sm">
            <span className="inline-block px-3 py-1 bg-[#fae6cf] text-[#85350f] text-xs font-bold rounded-lg mb-3">
              {currentArticle.categoryLabel}
            </span>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1a140d] leading-tight mb-4">
              {currentArticle.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#826a48] pb-6 border-b border-[#ebd7be] mb-6">
              <span className="flex items-center gap-1 font-medium text-[#2c2416]">
                <User size={14} className="text-[#c8531c]" /> {currentArticle.author} ({currentArticle.authorRole})
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {currentArticle.publishedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {currentArticle.readTime}
              </span>
            </div>

            {/* Table of contents */}
            <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#ebd7be] mb-8">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#85350f] mb-2">
                In This Article:
              </h4>
              <ul className="space-y-1 text-xs text-[#614d33]">
                {currentArticle.headings.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#c8531c] font-bold">{i + 1}.</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#463825] leading-relaxed mb-8">
              {currentArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Frequently Asked Questions */}
            {currentArticle.faqs && currentArticle.faqs.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#ebd7be]">
                <h3 className="font-serif text-lg font-bold text-[#1a140d] mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {currentArticle.faqs.map((faq, i) => (
                    <div key={i} className="bg-[#fcfaf7] p-4 rounded-xl border border-[#ebd7be]">
                      <h4 className="font-bold text-xs sm:text-sm text-[#2c2416] mb-1">
                        Q: {faq.question}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#614d33] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-8 pt-4 border-t border-[#ebd7be]">
              {currentArticle.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-[#fcfaf7] text-[#826a48] border border-[#ebd7be] px-2.5 py-1 rounded-lg"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  // ARTICLES CATALOG VIEW
  return (
    <div className="w-full bg-[#fcfaf7] text-[#2c2416] pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#fae6cf] to-[#fcfaf7] border-b border-[#ebd7be] py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fae6cf] border border-[#f3a76d] text-[#c8531c] text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen size={14} />
            <span>Shastric Knowledge Hub</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1a140d] mb-2">
            Vedic Astrology Articles & Research Guides
          </h1>
          <p className="text-xs sm:text-sm text-[#614d33] max-w-xl mx-auto mb-6">
            Explore authentic astronomical explanations for 27 Nakshatras, Saturn transits, Sade Sati, Raj Yogas, and Ratna Shastra.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-3.5 top-3 text-[#a48e71]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, planet, or yoga..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ebd7be] focus:border-[#c8531c] focus:outline-hidden bg-white text-xs shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#ebd7be]">
          {[
            { id: "all", label: "All Topics" },
            { id: "nakshatras", label: "27 Nakshatras" },
            { id: "sade-sati", label: "Sade Sati & Shani" },
            { id: "yogas", label: "Auspicious Yogas" },
            { id: "gemstones", label: "Ratna Shastra" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#c8531c] text-white shadow-xs"
                  : "bg-white text-[#614d33] border border-[#ebd7be] hover:bg-[#fae6cf]/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.slug}
              className="bg-white rounded-2xl border border-[#ebd7be] p-5 shadow-xs hover:border-[#c8531c] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8531c] bg-[#fae6cf] px-2 py-0.5 rounded-md mb-2 inline-block">
                  {art.categoryLabel}
                </span>

                <h3
                  onClick={() => onNavigate({ page: "blogs", slug: art.slug })}
                  className="font-serif font-bold text-base text-[#1a140d] hover:text-[#c8531c] cursor-pointer transition-colors leading-snug mb-2"
                >
                  {art.title}
                </h3>

                <p className="text-xs text-[#614d33] line-clamp-3 mb-4 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ebd7be] flex items-center justify-between text-xs">
                <span className="text-[#a48e71]">{art.readTime}</span>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "blogs", slug: art.slug })}
                  className="font-bold text-[#c8531c] hover:underline flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
