import { FetchError, ofetch } from 'ofetch'

import type { FeishuInteractiveCard } from './card'

export interface FeishuWebhookResponse {
  code: number
  msg: string
  data?: unknown
}

export interface SendCardOptions {
  webhookUrl: string
  card: FeishuInteractiveCard
  timeoutMs?: number
}

const client = ofetch.create({
  headers: {
    'Content-Type': 'application/json'
  },
  retry: 0
})

/**
 * 负责向飞书 webhook 推送交互式卡片，默认使用 ofetch 并保留详细错误信息
 */
export async function sendCardToWebhook(options: SendCardOptions): Promise<FeishuWebhookResponse> {
  const { webhookUrl, card, timeoutMs } = options

  const payload = {
    msg_type: 'interactive',
    card
  }

  try {
    const response = await client.raw<FeishuWebhookResponse>(webhookUrl, {
      method: 'POST',
      body: payload,
      timeout: timeoutMs
    })

    const { status, _data } = response

    if (status < 200 || status >= 300) {
      throw new Error(`飞书接口返回 HTTP ${status}`)
    }

    if (!_data || typeof _data.code !== 'number') {
      throw new Error('飞书接口返回内容为空或结构异常')
    }

    if (_data.code !== 0) {
      throw new Error(`飞书接口响应异常：${JSON.stringify(_data)}`)
    }

    return _data
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.status === 408 || error.cause?.name === 'AbortError') {
        throw new Error('请求飞书接口超时')
      }

      if (typeof error.status === 'number' && error.status >= 400) {
        const bodyText = typeof error.data === 'string' ? error.data : JSON.stringify(error.data ?? {})
        throw new Error(`飞书接口返回 HTTP ${error.status}：${bodyText}`)
      }
    }

    throw error instanceof Error ? error : new Error('请求飞书接口失败')
  }
}
