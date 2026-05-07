import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE = 'https://yce-api-01.makeupar.com'

export async function POST(req: NextRequest) {
  try {
    const { src_file_id, cloth_file_url, src_file_url } = await req.json()

    const body: Record<string, any> = { body_part: 'auto' }
    if (src_file_id) body.src_file_id = src_file_id
    else if (src_file_url) body.src_file_url = src_file_url
    if (cloth_file_url) body.cloth_file_url = cloth_file_url

    const res = await fetch(`${BASE}/s2s/v2.0/task/cloth`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    console.log('Clothes VTO response:', JSON.stringify(data).slice(0, 200))
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
