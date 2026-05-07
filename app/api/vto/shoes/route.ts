import { NextRequest, NextResponse } from 'next/server'
const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE = 'https://yce-api-01.makeupar.com'
export async function POST(req: NextRequest) {
  try {
    const { src_file_id, src_file_url, shoes_file_url } = await req.json()
    const body: Record<string, any> = {}
    if (src_file_id) body.src_file_id = src_file_id
    else if (src_file_url) body.src_file_url = src_file_url
    if (shoes_file_url) body.shoes_file_url = shoes_file_url
    const res = await fetch(`${BASE}/s2s/v2.0/task/shoes`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return NextResponse.json(await res.json())
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
