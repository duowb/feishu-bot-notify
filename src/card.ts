export interface ComponentUpdateCardOptions {
  /**
   * 组件名称，卡片中会以加粗形式展示
   */
  componentName: string
  /**
   * 版本号，建议遵循语义化版本
   */
  version: string
  /**
   * 更新说明或者更新说明列表，将渲染成 Markdown 项目符号。
   */
  changes: string |  string[]
  /**
   * 按钮跳转链接，例如组件文档或体验地址
   */
  buttonUrl: string
  /**
   * 卡片标题，可依据业务场景调整
   */
  title?: string
  /**
   * 按钮文字，默认使用“去看看”
   */
  buttonText?: string
}

export interface FeishuInteractiveCard {
  schema: '2.0'
  config: {
    update_multi: boolean
    style?: Record<string, unknown>
  }
  header: {
    title: {
      tag: 'plain_text'
      content: string
    }
    template?: string
    icon?: Record<string, unknown>
    padding?: string
  }
  body: {
    direction: 'vertical'
    padding: string
    elements: Array<Record<string, unknown>>
  }
}

const DEFAULT_TITLE = '组件更新啦！！！'
const DEFAULT_BUTTON_TEXT = '去看看'

/**
 * 构造飞书交互式卡片
 */
export function buildComponentUpdateCard(options: ComponentUpdateCardOptions): FeishuInteractiveCard {
  const { componentName, version, changes, buttonUrl, title, buttonText } = options

  const markdownUpdates = formatChanges(changes)

  return {
    schema: '2.0',
    config: {
      update_multi: true,
      style: {
        text_size: {
          normal_v2: {
            default: 'normal',
            pc: 'normal',
            mobile: 'heading'
          }
        }
      }
    },
    header: {
      title: {
        tag: 'plain_text',
        content: title ?? DEFAULT_TITLE
      },
      template: 'blue',
      icon: {
        tag: 'standard_icon',
        token: 'speaker_filled'
      },
      padding: '12px 12px 12px 12px'
    },
    body: {
      direction: 'vertical',
      padding: '12px 12px 12px 12px',
      elements: [
        {
          tag: 'hr',
          margin: '0px 0px 0px 0px'
        },
        buildMetaColumn(componentName, version),
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**📝更新说明：**\n${markdownUpdates}`,
            text_size: 'normal_v2',
            text_align: 'left',
            text_color: 'default',
            lines: 5
          },
          margin: '0px 0px 0px 0px'
        },
        {
          tag: 'hr',
          margin: '0px 0px 0px 0px'
        },
        {
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: buttonText ?? DEFAULT_BUTTON_TEXT
          },
          type: 'primary_filled',
          width: 'default',
          size: 'medium',
          behaviors: [
            {
              type: 'open_url',
              default_url: buttonUrl
            }
          ],
          margin: '0px 0px 0px 0px',
          element_id: 'go_component_url'
        }
      ]
    }
  }
}

function buildMetaColumn(componentName: string, version: string) {
  return {
    tag: 'column_set',
    columns: [
      {
        tag: 'column',
        width: 'weighted',
        elements: [
          {
            tag: 'markdown',
            content: `**📦组件名称：**${componentName}`,
            text_align: 'left',
            text_size: 'normal_v2'
          }
        ],
        vertical_align: 'top',
        weight: 1
      },
      {
        tag: 'column',
        width: 'weighted',
        elements: [
          {
            tag: 'markdown',
            content: `**💥版本：** ${version}`,
            text_align: 'left',
            text_size: 'normal_v2'
          }
        ],
        vertical_align: 'top',
        weight: 1
      }
    ]
  }
}

function formatChanges(changes: string | string[]): string {
  if (!Array.isArray(changes)) return changes;
  if (!changes.length) {
    return '- 暂无更新内容'
  }

  return changes
    .map((item) => (item.startsWith('-') ? item : `- ${item}`))
    .join('\n')
}
