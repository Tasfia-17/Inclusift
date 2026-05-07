import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE = 'https://yce-api-01.makeupar.com'

// Map our internal names to Perfect Corp file endpoint names
const FILE_ENDPOINT: Record<string, string> = {
  'cloth':         'cloth',
  'shoes':         'shoes',
  'skin-analysis': 'skin-analysis',
  'makeup-vto':    'makeup-vto',
  'hair-color':    'hair-color',
  'earring':       '2d-vto/earring',
  'face':          'face-attr-analysis',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const apiName = (formData.get('api') as string) || 'cloth'
    const endpoint = FILE_ENDPOINT[apiName] || apiName

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    // 1. Get pre-signed upload URL
    const uploadRes = await fetch(`${BASE}/s2s/v2.0/file/${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' }
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      console.error('Upload URL error:', err)
      return NextResponse.json({ error: err }, { status: uploadRes.status })
    }

    const uploadData = await uploadRes.json()
    const { file_id, upload_url } = uploadData.data || uploadData

    // 2. PUT file to pre-signed URL
    const buffer = await file.arrayBuffer()
    const putRes = await fetch(upload_url, {
      method: 'PUT',
      body: buffer,
      headers: { 'Content-Type': file.type || 'image/jpeg' }
    })

    if (!putRes.ok) {
      return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 })
    }

    return NextResponse.json({ file_id })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
