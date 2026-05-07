import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE_URL = 'https://yce-api-01.makeupar.com'

export async function POST(req: NextRequest) {
  try {
    const { src_file_url, makeup_items } = await req.json()

    const res = await fetch(`${BASE_URL}/s2s/v2.0/task/makeup-vto`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ src_file_url, makeup_items })
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
