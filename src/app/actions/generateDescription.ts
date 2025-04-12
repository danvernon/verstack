// app/actions/generateDescription.ts
"use server";

import { Requisition } from "@/server/db/schema";
import { openrouterClient } from "@/utils/open-ai";

export async function generateJobDescription({
  jobData,
}: {
  jobData?: Requisition;
}) {
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
            
            Format your response using markdown with headers, bullet points, and appropriate styling.
          `,
        },
      ],
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating job description:", error);
    throw error;
  }
}
