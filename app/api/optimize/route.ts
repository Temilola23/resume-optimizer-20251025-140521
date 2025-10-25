import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    if (!content) {
      return Response.json({ error: "No content provided" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert resume optimizer and career coach. Analyze the following resume and improve it by:

1. Enhancing action verbs and impact statements
2. Quantifying achievements where possible
3. Improving formatting and structure
4. Making descriptions more concise and powerful
5. Highlighting key skills and accomplishments
6. Ensuring ATS (Applicant Tracking System) compatibility
7. Removing redundancies and weak language

Maintain the original format structure (sections, bullet points, etc.) but improve the content quality.

Original Resume:
${content}

Provide the optimized version:`,
    })

    return Response.json({ optimizedContent: text })
  } catch (error) {
    console.error("[v0] Error in optimize API:", error)
    return Response.json({ error: "Failed to optimize resume" }, { status: 500 })
  }
}
