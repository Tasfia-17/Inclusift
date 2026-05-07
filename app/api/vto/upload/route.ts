import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE_URL = 'https://yce-api-01.makeupar.com'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const api = formData.get('api') as string || 'cloth'

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    // Step 1: Get pre-signed upload URL
    const uploadRes = await fetch(`${BASE_URL}/s2s/v2.0/file/${api}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      return NextResponse.json({ error: err }, { status: uploadRes.status })
    }

    const { file_id, upload_url } = await uploadRes.json()

    // Step 2: Upload file to pre-signed URL
    const buffer = await file.arrayBuffer()
    await fetch(upload_url, {
      method: 'PUT',
      body: buffer,
      headers: { 'Content-Type': file.type }
    })

    return NextResponse.json({ file_id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
