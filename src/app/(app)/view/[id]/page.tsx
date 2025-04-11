import { Suspense } from "react";
import { Requisition } from "@/server/db/schema";
import { api } from "@/trpc/server";
import { openrouterClient } from "@/utils/open-ai";
import ReactMarkdown from "react-markdown";

const MarkdownComponents = {
  // Add more spacing between paragraphs
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-6">{children}</p>
  ),

  // Add more spacing for headers
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-8 mb-6 text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-8 mb-5 text-2xl font-semibold">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-6 mb-4 text-xl font-semibold">{children}</h3>
  ),

  // More spacing for lists
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-6 ml-5 list-disc space-y-3">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-6 ml-5 list-decimal space-y-3">{children}</ol>
  ),

  // Add spacing for list items
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-2">{children}</li>
  ),

  // Add spacing for horizontal rules
  hr: () => <hr className="my-8" />,

  // Add spacing around blockquotes
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-6 border-l-4 border-gray-300 pl-4 italic">
      {children}
    </blockquote>
  ),

  // Better styling for strong text
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="text-primary font-bold">{children}</strong>
  ),
};

const GenerateAndSaveJobDescription = async ({
  jobData,
}: {
  jobData?: Requisition;
}) => {
  try {
    const completion = await openrouterClient.chat.completions.create({
      model: "google/gemma-3-4b-it",
      messages: [
        {
          role: "user",
          content: `
            You are a recruitment requisition tool.
            Create a detailed job description for a ${jobData?.title} position at Peppy a health tech company.
            Analyze this data about the job:
            Based on the following job title and industry, suggest the most relevant:
            Job title: ${jobData?.title}
            Seniority: ${jobData?.level}
            Employment type: ${jobData?.type}
            Subtype: ${jobData?.subType}
            Reason: ${jobData?.reason}
            Location: ${jobData?.location}

            Please provide:
            1. Essential technical skills (5-7)
            2. Preferred qualifications (3-5)
            3. Required education/certifications
            4. Recommended years of experience
            5. Format your response in a clear and structured manner.
          `,
        },
      ],
    });

    const generatedContent = completion.choices[0].message.content || "";

    console.log("Generated content:", generatedContent);

    // Save the generated content to the database
    await api.requisition.updateDescription({
      id: jobData?.id as string,
      description: generatedContent,
    });

    return (
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown components={MarkdownComponents}>
          {completion.choices[0].message.content || ""}
        </ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.error("Error generating job description:", error);
    return (
      <div className="text-red-500">
        Failed to generate job description. Please try again later.
      </div>
    );
  }
};

const DisplayJobDescription = ({
  description,
}: {
  description: string | null;
}) => {
  // Check if the description is already in HTML format
  if (description?.startsWith("<") && description?.includes("</")) {
    return (
      <div
        className="prose dark:prose-invert [&_strong]:text-primary max-w-none space-y-4 [&_h1]:mt-8 [&_h1]:mb-6 [&_h2]:mt-8 [&_h2]:mb-5 [&_h3]:mt-6 [&_h3]:mb-4 [&_hr]:my-8 [&_li]:mb-2 [&_ol]:mb-6 [&_ol]:ml-5 [&_ol]:space-y-3 [&_p]:mb-6 [&_strong]:font-bold [&_ul]:mb-6 [&_ul]:ml-5 [&_ul]:space-y-3"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  // Otherwise, treat it as markdown
  return (
    <div className="prose dark:prose-invert max-w-none space-y-4">
      <ReactMarkdown components={MarkdownComponents}>
        {description}
      </ReactMarkdown>
    </div>
  );
};

const JobDescriptionSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );
};

export default async function ViewSingle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const requisition = await api.requisition.get({
    id,
  });

  const hasExistingDescription =
    requisition?.description && requisition.description.length > 0;

  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      {/* Display basic job info immediately */}
      <div className="mb-8 w-full max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">{requisition?.title}</h1>
        <div className="mb-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            Draft
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {requisition?.level}
          </span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            {requisition?.type}
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {requisition?.location}
          </span>
        </div>
      </div>

      {/* Use Suspense boundary for AI-generated content */}
      <div className="w-full max-w-3xl">
        <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
        {hasExistingDescription ? (
          // Use the existing description
          <DisplayJobDescription description={requisition.description} />
        ) : (
          // Generate a new description
          <Suspense fallback={<JobDescriptionSkeleton />}>
            <GenerateAndSaveJobDescription jobData={requisition} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
