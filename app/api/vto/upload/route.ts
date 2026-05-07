import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY || 'sk-nAlDD07hAMNOq0L2yJTDNPnSDAf6kEASZasf9eXZkm_6VIQVISAxXfOp7f1VUBct'
const BASE = 'https://yce-api-01.makeupar.com'

const FILE_ENDPOINT: Record<string, string> = {
  'cloth': 'cloth', 'shoes': 'shoes', 'skin-analysis': 'skin-analysis',
  'makeup-vto': 'makeup-vto', 'hair-color': 'hair-color',
  'earring': '2d-vto/earring', 'face': 'face-attr-analysis',
  'bag': 'bag', 'hat': 'hat', 'ring': '2d-vto/ring',
  'bracelet': '2d-vto/bracelet', 'watch': '2d-vto/watch', 'necklace': '2d-vto/necklace',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const apiName = (formData.get('api') as string) || 'cloth'
    const endpoint = FILE_ENDPOINT[apiName] || apiName

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    // Step 1: Request pre-signed upload URL with correct format
    const uploadRes = await fetch(`${BASE}/s2s/v2.0/file/${endpoint}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: [{
          file_name: file.name || 'photo.jpg',
          file_size: file.size,
          content_type: file.type || 'image/jpeg'
        }]
      })
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      console.error('Upload URL error:', err)
      return NextResponse.json({ error: err }, { status: uploadRes.status })
    }

    const uploadData = await uploadRes.json()
    const fileInfo = uploadData?.data?.files?.[0]
    if (!fileInfo) return NextResponse.json({ error: 'No file info returned', raw: uploadData }, { status: 500 })

    const { file_id, requests } = fileInfo
    const putUrl = requests?.[0]?.url
    if (!putUrl) return NextResponse.json({ error: 'No upload URL', raw: fileInfo }, { status: 500 })

    // Step 2: PUT file to pre-signed URL
    const buffer = await file.arrayBuffer()
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      body: buffer,
      headers: {
        'Content-Type': file.type || 'image/jpeg',
        'Content-Length': file.size.toString()
      }
    })

    if (!putRes.ok) {
      const err = await putRes.text()
      console.error('PUT error:', err)
      return NextResponse.json({ error: 'Failed to upload to storage: ' + err }, { status: 500 })
    }

    return NextResponse.json({ file_id })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
