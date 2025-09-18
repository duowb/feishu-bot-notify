import { sendComponentUpdateNotification } from '../src/index'

async function main() {
  const webhookUrl = process.env.FEISHU_WEBHOOK ?? ''

  if (!webhookUrl) {
    throw new Error('请在环境变量 FEISHU_WEBHOOK 中提供飞书机器人 webhook 地址')
  }

  await sendComponentUpdateNotification({
    webhookUrl,
    componentName: '@one-public/icons',
    version: '0.0.1',
    changes: [
      '新增 20+ 图标及优化使用体验。',
      '测试2',
      '测试3',
      '测试4',
      '测试5',
      '测试6',
    ],
    buttonUrl: 'https://icons-playground.vercel.app/',
    title: '组件更新啦！！！',
    buttonText: '去看看',
  })

  console.log('飞书通知发送完成')
}

main().catch((error) => {
  console.error('发送失败：', error)
  process.exitCode = 1
})
