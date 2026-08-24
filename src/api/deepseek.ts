import { tools } from './aiTools'

const API_KEY = import.meta.env.VITE_API_KEY
const API_URL = '/api/v1/chat/completions'

export async function askAI(userMessage: string) {

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

    return data.choices[0].message
}