import { NextRequest, NextResponse } from 'next/server'
const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE = 'https://yce-api-01.makeupar.com'
export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 512, height = 512 } = await req.json()
    const res = await fetch(`${BASE}/s2s/v2.0/task/text-to-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, width, height })
    })
    return NextResponse.json(await res.json())
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
