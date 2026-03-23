import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { storiesService } from "@/lib/storiesService";
import { dbHelpers } from "@/lib/db";
import StoryReader from "@/components/StoryReader";
import { logger } from "@/lib/logger";

export const revalidate = 60;
export const dynamicParams = true;
export const runtime = "nodejs";

type StoryPageParams = {
  id: string;
};

export function generateStaticParams(): { id: string }[] {
  try {
    return storiesService.getApprovedStoryIds().map((id) => ({ id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<StoryPageParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const story = storiesService.getById(id);

  if (!story || !story.isApproved) {
    return {
      title: "Priča nije pronađena",
      description: "Tražena priča ne postoji ili nije dostupna.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pricezalakunoc.hr";
  const url = `${baseUrl}/story/${story.id}`;
  const title = `${story.title} – Priče za laku noć`;
  const description = story.body.slice(0, 160).replace(/\s+\S*$/, "") + "…";
  const imageUrl = story.imageUrl ? `${baseUrl}${story.imageUrl}` : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: story.createdAt,
      modifiedTime: story.updatedAt,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: story.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<StoryPageParams>;
}) {
  const { id } = await params;

  let story: Awaited<ReturnType<typeof storiesService.getById>> = null;
  let related: { id: string; title: string; author: string; readingTime?: number }[] = [];
  try {
    story = storiesService.getById(id);
    if (!story || !story.isApproved) {
      notFound();
    }
    related = dbHelpers.getRelatedStories(story!.id, story!.author, 3);
  } catch (error) {
    logger.error("Error loading story:", error);
    notFound();
  }

  if (!story || !story.isApproved) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pricezalakunoc.hr";
  const storyUrl = `${baseUrl}/story/${story.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: story.title,
    author: {
      "@type": "Person",
      name: story.author,
    },
    image: story.imageUrl || undefined,
    datePublished: story.createdAt,
    dateModified: story.updatedAt,
    aggregateRating:
      story.averageRating && story.ratingCount
        ? {
            "@type": "AggregateRating",
            ratingValue: story.averageRating,
            ratingCount: story.ratingCount,
          }
        : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Početna",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: story.title,
        item: storyUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
        <StoryReader
          key={story.id}
          storyId={story.id}
          title={story.title}
          author={story.author}
          body={story.body}
          imageUrl={story.imageUrl}
          averageRating={story.averageRating}
          ratingCount={story.ratingCount}
          readingTime={story.readingTime}
          readCount={story.readCount}
          relatedStories={related}
        />
    </>
  );
}
