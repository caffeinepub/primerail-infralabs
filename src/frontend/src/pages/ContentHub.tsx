import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePublishedContent } from "@/hooks/useQueries";
import { Calendar, ChevronDown, FileText, User } from "lucide-react";
import { useState } from "react";
import type { ContentCategory, ContentItem } from "../backend.d";

type CategoryKey = "All" | "Post" | "Blog" | "News" | "Article";

const TABS: { key: CategoryKey; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Post", label: "Posts" },
  { key: "Blog", label: "Blog" },
  { key: "News", label: "News" },
  { key: "Article", label: "Articles" },
];

function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCategoryColor(cat: ContentCategory): string {
  const map: Record<string, string> = {
    Post: "bg-blue-100 text-blue-700",
    Blog: "bg-purple-100 text-purple-700",
    News: "bg-orange-100 text-orange-700",
    Article: "bg-green-100 text-green-700",
  };
  return map[cat.__kind__] ?? "bg-gray-100 text-gray-700";
}

function ContentCard({ item }: { item: ContentItem }) {
  const [expanded, setExpanded] = useState(false);
  const excerpt =
    item.body.length > 200 ? `${item.body.slice(0, 200)}...` : item.body;

  return (
    <article className="bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      {item.imageUrl.__kind__ === "Some" ? (
        <div className="h-48 overflow-hidden flex-shrink-0">
          <img
            src={item.imageUrl.value}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-navy/10 to-navy/5 flex items-center justify-center flex-shrink-0">
          <FileText className="h-12 w-12 text-navy/20" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getCategoryColor(item.category)}`}
          >
            {item.category.__kind__}
          </span>
        </div>

        <h3 className="font-display font-bold text-navy text-lg leading-snug mb-2 line-clamp-2">
          {item.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <User size={11} />
            {item.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(item.createdAt)}
          </span>
        </div>

        <div className="text-sm text-navy/70 leading-relaxed flex-1">
          {expanded ? item.body : excerpt}
        </div>

        {item.body.length > 200 && (
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-orange hover:text-orange-hover transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </article>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function ContentGrid({
  items,
  isLoading,
}: {
  items: ContentItem[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-ocid="content.loading_state"
      >
        {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
          <CardSkeleton key={k} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="text-center py-20 text-muted-foreground"
        data-ocid="content.empty_state"
      >
        <FileText className="mx-auto h-14 w-14 mb-4 opacity-20" />
        <p className="text-lg font-medium text-navy/60">
          No content in this category yet
        </p>
        <p className="text-sm mt-1">Check back soon for updates.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div key={item.id.toString()} data-ocid={`content.item.${idx + 1}`}>
          <ContentCard item={item} />
        </div>
      ))}
    </div>
  );
}

export default function ContentHub() {
  const { data: allItems = [], isLoading } = usePublishedContent();
  const [activeTab, setActiveTab] = useState<CategoryKey>("All");

  return (
    <section id="insights" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest text-orange text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Latest Updates
          </span>
          <h2 className="text-4xl font-display font-bold text-black">
            News, Posts &amp; Insights
          </h2>
          <p className="text-navy/60 max-w-2xl mx-auto">
            Stay updated with PrimeRail&apos;s latest news, project insights,
            industry articles and announcements.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as CategoryKey)}
          className="w-full"
        >
          <TabsList
            className="mb-8 bg-white border border-border shadow-sm p-1 rounded-xl h-auto flex-wrap"
            data-ocid="content.hub.tab"
          >
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="data-[state=active]:bg-navy data-[state=active]:text-white rounded-lg"
                data-ocid={`content.${tab.key.toLowerCase()}.tab`}
              >
                {tab.label}
                {tab.key !== "All" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    (
                    {
                      allItems.filter((i) => i.category.__kind__ === tab.key)
                        .length
                    }
                    )
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab.key} value={tab.key} className="mt-0">
              <ContentGrid
                items={
                  tab.key === "All"
                    ? allItems
                    : allItems.filter((i) => i.category.__kind__ === tab.key)
                }
                isLoading={isLoading}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
