import { onMounted, onUnmounted, ref } from 'vue'

export interface TypedOptions {
  typeSpeed?: number
  backSpeed?: number
  startDelay?: number
  backDelay?: number
  loop?: boolean
  loopCount?: number
  sequence?: string
  showCursor?: boolean
}

interface TextNode {
  text: string
  element: HTMLElement | null
  children: TextNode[]
}

export function useTyped(element: Ref<HTMLElement | null>, options: TypedOptions = {}) {
  const {
    typeSpeed = 50,
    backSpeed = 80,
    startDelay = 300,
    backDelay = 1000,
    loop = false,
    loopCount = Infinity,
    sequence = '101',
    showCursor = true,
  } = options

  let timer: NodeJS.Timeout | null = null
  let currentLoop = 0
  const textTree = ref<TextNode[]>([])
  const isTyping = ref(false)

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // 解析 HTML 结构，构建文本节点树
  const parseHTML = (node: HTMLElement): TextNode[] => {
    const nodes: TextNode[] = []

    for (const childNode of Array.from(node.childNodes)) {
      if (childNode.nodeType === Node.TEXT_NODE) {
        // 文本节点
        const text = childNode.textContent || ''
        if (text.trim()) {
          nodes.push({
            text,
            element: null,
            children: [],
          })
        }
      }
      else if (childNode.nodeType === Node.ELEMENT_NODE) {
        // 元素节点
        const element = childNode as HTMLElement
        const children = parseHTML(element)
        if (children.length) {
          nodes.push({
            text: '',
            element: element.cloneNode(false) as HTMLElement,
            children,
          })
        }
      }
    }
    return nodes
  }

  // 将文本节点树渲染为 HTML
  const renderTextTree = (nodes: TextNode[], currentText: string = ''): [string, number] => {
    let html = ''
    let charCount = 0
    let lastTextNodeEnd = 0 // 记录最后一个非空文本节点的结束位置

    for (const node of nodes) {
      if (node.element) {
        // 元素节点
        const [innerHtml, innerCount] = renderTextTree(node.children, currentText.slice(charCount))
        if (innerHtml) {
          const clone = node.element.cloneNode(false) as HTMLElement
          clone.innerHTML = innerHtml
          html += clone.outerHTML
        }
        charCount += innerCount
      }
      else {
        // 文本节点
        const nodeText = currentText.slice(charCount, charCount + node.text.length)
        if (nodeText) {
          lastTextNodeEnd = html.length + nodeText.length
          html += nodeText
        }
        charCount += node.text.length
      }
    }

    // 只在实际有文本的情况下添加光标，并且只在最后一个非空文本节点后添加
    if (showCursor && currentText && lastTextNodeEnd > 0) {
      const before = html.slice(0, lastTextNodeEnd)
      const after = html.slice(lastTextNodeEnd)
      html = `${before}<span class="typed-cursor"></span>${after}`
    }

    return [html, charCount]
  }

  // 获取所有文本的总长度
  const getTotalLength = (nodes: TextNode[]): number => {
    return nodes.reduce((total, node) => {
      if (node.element)
        return total + getTotalLength(node.children)
      return total + node.text.length
    }, 0)
  }

  // 获取所有文本内容
  const getAllText = (nodes: TextNode[]): string => {
    return nodes.reduce((text, node) => {
      if (node.element)
        return text + getAllText(node.children)
      return text + node.text
    }, '')
  }

  const typeText = async (container: HTMLElement, targetLength: number) => {
    let currentLength = 0
    const fullText = getAllText(textTree.value)
    const characters = Array.from(fullText)

    while (currentLength < targetLength) {
      currentLength++
      const text = characters.slice(0, currentLength).join('')
      const [html] = renderTextTree(textTree.value, text)
      container.innerHTML = html
      await sleep(typeSpeed)
    }
  }

  const backspaceText = async (container: HTMLElement, targetLength: number) => {
    const fullText = getAllText(textTree.value)
    const characters = Array.from(fullText)
    const currentLength = characters.length

    for (let i = currentLength; i > targetLength; i--) {
      const text = characters.slice(0, i - 1).join('')
      const [html] = renderTextTree(textTree.value, text)
      container.innerHTML = html
      await sleep(backSpeed) // 每删除一个字符都等待
    }
  }

  const startTyping = async () => {
    if (!element.value || isTyping.value)
      return

    isTyping.value = true
    const container = element.value

    // 初始化文本树
    if (!textTree.value.length)
      textTree.value = parseHTML(container)

    // 验证序列
    if (!/^[01]+$/.test(sequence)) {
      console.error('Invalid sequence. Only 0 and 1 are allowed.')
      isTyping.value = false
      return
    }

    const totalLength = getTotalLength(textTree.value)
    container.innerHTML = ''
    await sleep(startDelay)

    do {
      let prevState = '0'
      for (const state of sequence) {
        if (state === prevState)
          continue

        if (state === '1') {
          await typeText(container, totalLength)
        }
        else {
          if (container.innerHTML !== '')
            await sleep(backDelay)
          await backspaceText(container, 0)
        }
        prevState = state
      }

      currentLoop++
    // eslint-disable-next-line no-unmodified-loop-condition
    } while (loop && currentLoop < loopCount)

    isTyping.value = false
  }

  const stop = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    isTyping.value = false
  }

  // 修改光标样式
  const addCursorStyle = () => {
    if (!showCursor)
      return

    const styleId = 'typed-cursor-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .typed-cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background: currentColor;
          margin-left: 0.1em;
          vertical-align: middle;
          animation: typed-blink 0.7s ease-in-out infinite;
          position: relative;
          opacity: 1;
        }
        @keyframes typed-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }
  }

  onMounted(() => {
    addCursorStyle()
    startTyping()
  })

  onUnmounted(() => {
    stop()
  })

  return {
    isTyping,
    stop,
    restart: startTyping,
  }
}
