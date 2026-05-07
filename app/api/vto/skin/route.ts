import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY || 'sk-nAlDD07hAMNOq0L2yJTDNPnSDAf6kEASZasf9eXZkm_6VIQVISAxXfOp7f1VUBct'
const BASE = 'https://yce-api-01.makeupar.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { src_file_id, src_file_url } = body

    const payload: Record<string, any> = {
      dst_actions: [
        'hd_acne', 'hd_pore', 'hd_moisture', 'hd_redness',
        'hd_texture', 'hd_wrinkle', 'hd_radiance', 'hd_oiliness',
        'hd_eye_bag', 'hd_dark_circle', 'hd_firmness', 'hd_age_spot'
      ],
      miniserver_args: { enable_mask_overlay: true }
    }
    if (src_file_id) payload.src_file_id = src_file_id
    else if (src_file_url) payload.src_file_url = src_file_url

    const res = await fetch(`${BASE}/s2s/v2.1/task/skin-analysis`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    console.log('Skin analysis response:', JSON.stringify(data).slice(0, 200))
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
