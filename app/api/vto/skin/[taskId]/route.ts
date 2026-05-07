import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.PERFECT_CORP_API_KEY
const BASE_URL = 'https://yce-api-01.makeupar.com'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  const res = await fetch(`${BASE_URL}/s2s/v2.1/task/skin-analysis/${taskId}`, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  })
  const data = await res.json()
  return NextResponse.json(data)
}
