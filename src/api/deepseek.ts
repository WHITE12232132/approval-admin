const BACKEND_URL = 'http://localhost:3001'

export async function askAI(userMessage: string) {
    // 1. 从后端获取工具列表（后端从 MCP Server 获取）
    const toolsResponse = await fetch(`${BACKEND_URL}/api/tools`)
    const { tools } = await toolsResponse.json()

    // 2. 发送请求给 DeepSeek
    const API_KEY = import.meta.env.VITE_API_KEY
    const API_URL = '/api/v1/chat/completions'

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'mimo-v2.5',
            messages: [
                { role: 'system', content: '你是一个审批表单助手，根据用户描述自动填充表单字段。' },
                { role: 'user', content: userMessage },
            ],
            tools: tools,
            tool_choice: 'auto',
        }),
    })

    const data = await response.json()
    const message = data.choices[0].message

    // 3. 如果 AI 决定调用工具，转发给后端执行
    if (message.tool_calls) {
        const toolCall = message.tool_calls[0]
        const args = JSON.parse(toolCall.function.arguments)

        // 调用后端 API（后端再转发给 MCP Server）
        const resultResponse = await fetch(`${BACKEND_URL}/api/tools/call`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: toolCall.function.name,
                arguments: args,
            }),
        })

        const { result } = await resultResponse.json()

        return {
            ...message,
            tool_call_result: result,
        }
    }

    return message
}
