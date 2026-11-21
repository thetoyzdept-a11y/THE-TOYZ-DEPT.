import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { requireAdmin } from "../auth";

export const aiRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Helper function to call OpenAI gpt-4o-mini
async function callOpenAI(
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens = 350,
  temperature = 0.7
) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as any;
    throw new Error(
      errorBody.error?.message || `OpenAI request failed with status ${res.status}`
    );
  }

  const data = (await res.json()) as any;
  return data.choices?.[0]?.message?.content || "";
}

const STORE_KNOWLEDGE_PROMPT = `
You are "TOYZ-AI", the official AI desk concierge and collector guide for THE TOYZ DEPT. (https://thetoyzdept.in).
Tone & Persona:
- Neo-brutalist, witty, enthusiastic, precise, and tech-savvy. Speak directly to desk-setup enthusiasts, gamers, software engineers, and tactile collectors.
- Keep responses concise, punchy, and helpful (typically 2-4 sentences max per response).
- Zero generic corporate fluff.

Store Overview:
- THE TOYZ DEPT. is an independent 3D printing & additive manufacturing studio based in Bengaluru, Karnataka, India.
- We engineer tactile articulated dragons, kinetic desk fidgets, brutalist desk gear (pen docks, headphone stands, phone mounts), and architectural planters.
- All items are 3D printed with 0.12mm–0.20mm micrometer precision in high-grade bio-based PLA+ and tough engineering PETG.

Product Drops:
1. Cyber Dragon: Articulated 22-joint leviathan dragon, flexible in-place printing (₹1,299).
2. Flexi Rex: Pocket desktop dinosaur with interlocking joints (₹499).
3. Crystal Serpent: Coiling segmented faceted snake (₹999).
4. Concrete Planter: Brutalist architectural vessel with drainage (₹899).
5. Headphone Stand: Heavy-base brutalist stand with cord cradle (₹1,199).
6. Cable Dock & Pen Rest: Dual-slot magnetic desk organizer (₹599).

Policies & Critical Info:
- 100% PREPAID ONLY: We do NOT offer Cash on Delivery (COD). Explain politely that prepaid eliminates 35% courier return damages and allows us to keep collector prices unbeatable!
- Dispatch & Delivery: Dispatched in 24–48 hours from Bengaluru via Shiprocket courier network (BlueDart, Delhivery, DTDC). Free shipping on orders over ₹999; flat ₹99 for orders below ₹999.
- Quality Promise: 48-Hour Unboxing Replacement Promise for genuine transit damage (uncut unboxing video required).
- Active Coupons:
  - "WELCOME10" (10% off on orders above ₹999)
  - "TOYZ20" (₹200 flat off on orders above ₹1,999)
  - "SURVEY15" (15% off instant reward for completing our 2-min survey at /survey)
- Monthly Giveaway: Users can take our survey at /survey to enter the Monthly Free Drop Giveaway to win a free articulated dragon or desk companion!

Formatting:
- Use clean formatting, emojis (🐉, ⚡, 📐, 🎁), and reference pages like /shop, /survey, /track-order, and /contact where relevant.
`;

/**
 * POST /api/ai/chat
 * Public storefront AI concierge chat powered by gpt-4o-mini
 */
aiRouter.post("/chat", async (c) => {
  try {
    const apiKey = c.env.OPENAI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "OpenAI API key is not configured on server." }, 503);
    }

    const body = (await c.req.json().catch(() => ({}))) as any;
    const { messages, context } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: "Messages array is required." }, 400);
    }

    // Keep conversation history compact to preserve affordability and low latency
    const recentMessages = messages.slice(-6).map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 1000),
    }));

    const systemPromptWithContext = context
      ? `${STORE_KNOWLEDGE_PROMPT}\n\nAdditional User Context: ${JSON.stringify(context)}`
      : STORE_KNOWLEDGE_PROMPT;

    const payload = [
      { role: "system", content: systemPromptWithContext },
      ...recentMessages,
    ];

    const reply = await callOpenAI(apiKey, payload, 350, 0.7);

    return c.json({
      success: true,
      reply,
      model: "gpt-4o-mini",
    });
  } catch (err: any) {
    console.error("AI chat error:", err);
    return c.json({ error: "AI assistant temporary glitch: " + err.message }, 500);
  }
});

/**
 * POST /api/ai/survey-spark
 * Generates imaginative, feasible 3D-printable collector ideas for survey takers
 */
aiRouter.post("/survey-spark", async (c) => {
  try {
    const apiKey = c.env.OPENAI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "OpenAI API key is not configured." }, 503);
    }

    const body = (await c.req.json().catch(() => ({}))) as any;
    const { prompt, favoriteCategory } = body;

    const promptInstruction = `
You are a lead 3D Industrial Design Engineer for THE TOYZ DEPT., a high-end tactile additive manufacturing brand.
A customer is participating in our product survey and needs inspiration for what we should 3D print next.

Input Category: ${favoriteCategory || "Articulated Creatures / Desk Fidgets"}
User Seed Keywords: ${prompt || "kinetic tactical desk gadget"}

Generate ONE compelling, feasible, 3D print-in-place concept.
Return strictly valid JSON with this exact schema:
{
  "title": "Creative 2-4 word product name (e.g. 'Tactile Mecha Mantis')",
  "concept": "A 2-sentence description explaining the interlocking joint mechanics, tactile satisfaction, and desk function.",
  "suggestedColors": "A cool filament combination (e.g. 'Dual-Tone Silk Cyber + Matte Carbon Black')",
  "tag": "e.g. 'Articulated Mechanical' or 'Haptic Desk Companion'"
}
Do not include markdown backticks. Just raw JSON.
`;

    const rawResponse = await callOpenAI(
      apiKey,
      [
        {
          role: "system",
          content: "You output only valid JSON without formatting or markdown backticks.",
        },
        { role: "user", content: promptInstruction },
      ],
      180,
      0.8
    );

    let parsed: any;
    try {
      const cleanJson = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = {
        title: "Kinetic Gyro Cube",
        concept:
          "A multi-ring interlocking gyroscope that spins smoothly on ceramic-tolerance 3D printed bearings to eliminate desk boredom.",
        suggestedColors: "Dual-Tone Silk Gold + Obsidian Black",
        tag: "Tactile Fidget",
      };
    }

    return c.json({
      success: true,
      idea: parsed,
    });
  } catch (err: any) {
    console.error("AI survey spark error:", err);
    return c.json({ error: "Failed to spark idea: " + err.message }, 500);
  }
});

/**
 * POST /api/ai/admin-survey-insights
 * Admin-only intelligence synthesis of recent customer survey feedback
 */
aiRouter.post("/admin-survey-insights", requireAdmin, async (c) => {
  try {
    const apiKey = c.env.OPENAI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "OpenAI API key not configured on server." }, 503);
    }

    // Load recent 50 survey responses from D1
    const surveys = await c.env.DB
      .prepare(`
        SELECT name, favorite_category, favorite_product, desired_colors, price_preference, product_ideas, rating, feedback, created_at
        FROM customer_surveys
        ORDER BY created_at DESC
        LIMIT 50
      `)
      .all<any>();

    const total = surveys.results?.length || 0;
    if (total === 0) {
      return c.json({
        success: true,
        summary:
          "No survey submissions recorded in database yet. Encourage collectors at /survey to build up your R&D intelligence!",
      });
    }

    const condensedData = surveys.results?.map((s) => ({
      cat: s.favorite_category,
      prod: s.favorite_product,
      colors: s.desired_colors,
      budget: s.price_preference,
      idea: s.product_ideas,
      rating: s.rating,
      comment: s.feedback,
    }));

    const analysisPrompt = `
You are the Chief Product Officer at THE TOYZ DEPT. (thetoyzdept.in).
Analyze the following ${total} customer survey responses and produce a sharp, executive-level Product R&D Briefing.

Customer Survey Submissions:
${JSON.stringify(condensedData)}

Format your response in GitHub Flavored Markdown with:
1. ### 🚀 Top Demanded Product Concepts (Synthesize the most requested items from customer ideas)
2. ### 🎨 Winning Filament Colors & Finishes (What shades have highest customer demand)
3. ### 💰 Pricing & Sweet Spot Analysis (What customers are willing to spend)
4. ### ⚡ Immediate Action Items for the Next Studio Drop (Concrete manufacturing recommendations)

Be concise, commercially focused, and insightful.
`;

    const summary = await callOpenAI(
      apiKey,
      [
        {
          role: "system",
          content: "You are a direct, senior additive manufacturing product strategist.",
        },
        { role: "user", content: analysisPrompt },
      ],
      600,
      0.5
    );

    return c.json({
      success: true,
      totalAnalyzed: total,
      summary,
    });
  } catch (err: any) {
    console.error("AI survey insights error:", err);
    return c.json({ error: "Failed to generate AI insights: " + err.message }, 500);
  }
});

/**
 * POST /api/ai/product-copy
 * Generates punchy neo-brutalist product description and specs for admin catalogue
 */
aiRouter.post("/product-copy", requireAdmin, async (c) => {
  try {
    const apiKey = c.env.OPENAI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "OpenAI API key is not configured." }, 503);
    }

    const body = (await c.req.json().catch(() => ({}))) as any;
    const { name, category, material } = body;

    if (!name) {
      return c.json({ error: "Product name is required." }, 400);
    }

    const prompt = `
You are a lead copywriter for THE TOYZ DEPT. (thetoyzdept.in), an independent 3D printing design studio in Bengaluru.
Write high-converting, neo-brutalist e-commerce copy for a new drop titled: "${name}".
Category: ${category || "Tactile Desk Gear"}
Material: ${material || "Bio-PLA+ / Matte PETG"}

Structure your response with:
- 1 punchy hook (1-2 sentences) on tactile feel, desk aura, and mechanical design.
- 1 short paragraph on print precision (0.16mm layer height, in-place printing, zero assembly).
- Specs list:
  • Material: High-Grade Bio-PLA+
  • Tolerances: 0.16mm Micrometer Layer Resolution
  • Origin: Engineered & Dispatched from Bengaluru
  • In-The-Box: 1x ${name} + Collector Authenticity Card

Keep it tight, stylish, and under 130 words.
`;

    const description = await callOpenAI(
      apiKey,
      [
        {
          role: "system",
          content: "You write ultra-crisp, stylish neo-brutalist e-commerce copy.",
        },
        { role: "user", content: prompt },
      ],
      250,
      0.7
    );

    return c.json({
      success: true,
      description,
    });
  } catch (err: any) {
    console.error("AI product copy error:", err);
    return c.json({ error: "Failed to generate copy: " + err.message }, 500);
  }
});
