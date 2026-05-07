import { NextRequest, NextResponse } from 'next/server'
const API_KEY = process.env.PERFECT_CORP_API_KEY || 'sk-nAlDD07hAMNOq0L2yJTDNPnSDAf6kEASZasf9eXZkm_6VIQVISAxXfOp7f1VUBct'
const BASE = 'https://yce-api-01.makeupar.com'
export async function GET(_: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const res = await fetch(`${BASE}/s2s/v2.0/task/text-to-image/${taskId}`, { headers: { 'Authorization': `Bearer ${API_KEY}` } })
  return NextResponse.json(await res.json())
}
