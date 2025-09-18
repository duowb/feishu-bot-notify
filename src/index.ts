import { buildComponentUpdateCard, type ComponentUpdateCardOptions, type FeishuInteractiveCard } from './card'
import { sendCardToWebhook, type FeishuWebhookResponse } from './sender'

export interface SendComponentUpdateOptions extends ComponentUpdateCardOptions {
  /**
   * 飞书机器人 webhook 地址
   */
  webhookUrl: string
  /**
   * 请求超时时间（毫秒），默认不限制
   */
  timeoutMs?: number
}

/**
 * 基于组件更新信息构建卡片并推送至飞书机器人
 */
export async function sendComponentUpdateNotification(
  options: SendComponentUpdateOptions
): Promise<FeishuWebhookResponse> {
  const { webhookUrl, timeoutMs, ...cardOptions } = options

  const card = buildComponentUpdateCard(cardOptions)
  return sendCardToWebhook({ webhookUrl, card, timeoutMs })
}

/**
 * 仅构建飞书交互式卡片，便于在外部服务中复用
 */
export function createComponentUpdateCard(options: ComponentUpdateCardOptions): FeishuInteractiveCard {
  return buildComponentUpdateCard(options)
}

export type { ComponentUpdateCardOptions, FeishuInteractiveCard, FeishuWebhookResponse }
