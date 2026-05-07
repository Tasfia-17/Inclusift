import { NextRequest, NextResponse } from 'next/server'
const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE = 'https://yce-api-01.makeupar.com'
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload: Record<string,any> = {}
    if (body.src_file_id) payload.src_file_id = body.src_file_id
    else if (body.src_file_url) payload.src_file_url = body.src_file_url
    if (body.item_file_url) payload.hat_file_url = body.item_file_url
    const res = await fetch(`${BASE}/s2s/v2.0/task/hat`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return NextResponse.json(await res.json())
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
