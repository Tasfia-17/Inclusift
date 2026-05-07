import { NextRequest, NextResponse } from 'next/server'
const API_KEY = process.env.PERFECT_CORP_API_KEY || 'sk-nAlDD07hAMNOq0L2yJTDNPnSDAf6kEASZasf9eXZkm_6VIQVISAxXfOp7f1VUBct'
const BASE = 'https://yce-api-01.makeupar.com'

// Default skin-smooth effect — works with skin_smooth category
const DEFAULT_EFFECTS = [{
  category: 'skin_smooth',
  palettes: [{ color: '#f5d5b0', opacity: 0.4, colorIntensity: 40, smoothness: 80, texture: 'natural', thickness: 40 }],
  shape: 'natural',
  style: { finish: 'natural' }
}]

export async function POST(req: NextRequest) {
  try {
    const { src_file_id, src_file_url, effects, makeup_items } = await req.json()
    const body: Record<string, any> = {
      effects: effects || DEFAULT_EFFECTS
    }
    if (src_file_id) body.src_file_id = src_file_id
    else if (src_file_url) body.src_file_url = src_file_url
    const res = await fetch(`${BASE}/s2s/v2.0/task/makeup-vto`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return NextResponse.json(await res.json())
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
