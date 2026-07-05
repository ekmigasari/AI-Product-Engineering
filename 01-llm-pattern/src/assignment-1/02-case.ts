// Case 2
// You receive a long meeting transcript and need decisions, risks, and action items.

// 1. User Input: "[transcript text]".
// 2. Extraction Agent: Identifies and extracts decisions, risks, and action items from the transcript.

// run: pnpm tsx src/assignment-1/02-case.ts


import { getModel, tavilyClient } from "../utils";
import { createParsedCompletion } from "@anvia/core";
import "dotenv/config";
import z from "zod";

const meetingTranscript = `
Meeting Date: June 24, 2026
Attendees: Sarah Chen (Product), Marcus Rivera (Engineering), Priya Nair (Finance), Tom Whitfield (Marketing), Angela Brooks (Operations), James Okafor (Legal)

--- TRANSCRIPT BEGIN ---

Sarah: Alright everyone, let's get started. We have a packed agenda today so I want to make sure we cover everything. First item is the Q3 budget review.

Priya: Thanks Sarah. So the current burn rate has us on track to exceed the Q3 budget by approximately 18% if we don't make adjustments. The main drivers are the cloud infrastructure costs and the contractor headcount we added in May. I'd like to assign someone from each team to submit a revised forecast by end of next week.

Marcus: On the engineering side, we can reduce cloud costs by about 12% if we complete the migration to the new instance types. We've been delaying that because of the product freeze, but if we get the green light, we can prioritize it.

Sarah: That's a good point. Let's make that a formal decision — Marcus, can you put together a migration plan and risk assessment by Friday? We'll review it and decide whether to lift the freeze for infrastructure work.

Marcus: Done. I'll have it ready by EOD Thursday actually.

Priya: Great. The other risk I want to flag is the exchange rate exposure on the EU contracts. With the euro weakening, we're looking at roughly $40K in potential losses next quarter if we don't hedge. James, is there anything on the legal side blocking us from entering a forward contract?

James: No blockers from a legal standpoint. I reviewed the counterparty agreements last month and we have the flexibility. The decision is really a finance and leadership call. I'd recommend looping in the CFO before committing.

Priya: Agreed. Action item on me — I'll schedule a call with the CFO this week and bring a hedging proposal.

Tom: Can I jump in on the marketing strategy item? We've been sitting on the go/no-go decision for the new campaign for three weeks now and the agency is getting restless. We need a decision by July 1st or we lose the media slots we've reserved.

Sarah: Understood. What's blocking the decision?

Tom: Two things. First, we don't have the conversion data from the pilot yet. Second, Marcus's team hasn't confirmed whether the landing page infrastructure can handle the projected traffic spike.

Marcus: We can handle the traffic — I'll send a written confirmation today. The load tests we ran last sprint showed we're good up to 50K concurrent users, which is well above the projection.

Tom: Perfect. That removes one blocker. On the conversion data, Priya, can your team pull the pilot numbers from the analytics dashboard?

Priya: I can have that by Wednesday.

Sarah: Okay, so we're targeting a final decision on the marketing campaign by Thursday this week. Tom, please send the decision criteria to the group so we're all aligned on what "go" looks like.

Tom: Will do — I'll send it today.

Angela: I want to raise something on the operations side. We've had three incidents in the last month where cross-departmental handoffs broke down — specifically between engineering and ops during deployments. We need a better process. I'd like to propose a joint runbook that both teams sign off on.

Marcus: Fully support that. We've felt the pain too. I can have someone from my team co-author the runbook with Angela's team.

Angela: Great. Let's target a draft by July 8th and then schedule a review session the following week.

Sarah: That's a good initiative. Let's formalize it — Angela and Marcus, please co-own the runbook. I'll add a review session to the calendar for July 15th.

James: I also need to flag a compliance risk. The new data retention regulation that comes into effect September 1st requires us to purge certain categories of user data within 30 days of deletion requests. Our current system takes up to 90 days. We need to either accelerate the engineering fix or apply for a regulatory extension.

Marcus: That's the first I'm hearing about the 90-day issue. Can you share the regulatory document, James? We'll assess what it takes to fix it.

James: I'll send it over after this call. My recommendation is to treat this as a critical priority — the fines for non-compliance are significant.

Sarah: Agreed. Marcus, please assess the engineering effort by next Monday and we'll decide whether to pursue a fix or apply for an extension. James, can you prepare the extension application in parallel just in case?

James: Already drafted. Just needs a technical annex from engineering.

Sarah: Perfect. Last item — the performance review cycle. HR has moved the deadline to July 31st. Managers need to complete self-assessments and peer nominations by July 10th.

Angela: I'll send a reminder to all team leads today.

Sarah: Thank you. Alright, let's recap the action items before we close...

--- TRANSCRIPT END ---
`;

const SYSTEM_PROMPT = `
You are an AI assistant that extracts structured information from meeting transcripts. Your task is to identify and extract the following information:
1. Decisions: List all decisions made during the meeting, including who made the decision and any relevant context.
2. Risks: Identify any risks or issues discussed during the meeting, along with their potential impact and any mitigation strategies mentioned.
3. Action Items: Extract all action items assigned during the meeting, including the responsible person and the due date if mentioned.
  `;

const MeetingInformationSchema = z.object({
    title: z.string().describe("Title of the meeting"),
    summary: z.string().describe("A short summary of the meeting, write in one paragraph"),
    decisions: z.array(z.string()).describe("List of decisions made during the meeting"),
    risks: z.array(z.string()).describe("List of risks identified during the meeting"),
    actionItems: z.array(z.string()).describe("List of action items assigned during the meeting"),
});

const response = await createParsedCompletion(getModel(), {
  instructions: SYSTEM_PROMPT,
  input: `Meeting Transcript: ${meetingTranscript}`,
  schema: MeetingInformationSchema,
});

console.log("Meeting Information:", response.data);



