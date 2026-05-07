import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY || 'sk-nAlDD07hAMNOq0L2yJTDNPnSDAf6kEASZasf9eXZkm_6VIQVISAxXfOp7f1VUBct'
const BASE = 'https://yce-api-01.makeupar.com'

export async function POST(req: NextRequest) {
  try {
    const { src_file_id, src_file_url, cloth_file_url, ref_file_url, garment_category } = await req.json()

    const body: Record<string, any> = {
      garment_category: garment_category || 'auto'
    }
    // Person photo
    if (src_file_id) body.src_file_id = src_file_id
    else if (src_file_url) body.src_file_url = src_file_url
    // Garment photo — API uses ref_file_url
    const garmentUrl = ref_file_url || cloth_file_url
    if (garmentUrl) body.ref_file_url = garmentUrl

    const res = await fetch(`${BASE}/s2s/v2.0/task/cloth`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    console.log('Clothes VTO:', JSON.stringify(data).slice(0, 200))
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
