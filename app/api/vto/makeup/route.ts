import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE = 'https://yce-api-01.makeupar.com'

export async function POST(req: NextRequest) {
  try {
    const { src_file_id, src_file_url, makeup_items } = await req.json()

    const payload: Record<string, any> = {
      makeup_items: makeup_items || [
        { type: 'foundation', color: '#e8c4a0' },
        { type: 'lipstick', color: '#c2185b' }
      ]
    }
    if (src_file_id) payload.src_file_id = src_file_id
    else if (src_file_url) payload.src_file_url = src_file_url

    const res = await fetch(`${BASE}/s2s/v2.0/task/makeup-vto`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
