export const MarkdownComponents = {
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
