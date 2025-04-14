import type { RequisitionWithPartialRelations } from "@/server/db/schema";
import { Suspense } from "react";
import { generateJobDescription } from "@/app/actions/generateDescription";
import { MarkdownComponents } from "@/components/markdown-components";
import { JobDescriptionSkeleton } from "@/components/view/skeleton";
import { api } from "@/trpc/server";
import ReactMarkdown from "react-markdown";

const GenerateAndSaveJobDescription = async ({
  jobData,
}: {
  jobData?: RequisitionWithPartialRelations;
}) => {
  try {
    const generatedContent = await generateJobDescription(jobData);

    // Save the generated content to the database
    await api.requisition.updateDescription({
      id: jobData?.id ?? "",
      description: generatedContent,
    });

    return (
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown components={MarkdownComponents}>
          {generatedContent}
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
        <h1 className="mb-2 text-3xl font-bold">
          #{requisition?.requisitionNumber} - {requisition?.title}
        </h1>
        <div className="mb-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            Draft
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {requisition?.level}
          </span>
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            {requisition?.workerType.name}
          </span>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {requisition?.office.name}
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {requisition?.location.name}
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
