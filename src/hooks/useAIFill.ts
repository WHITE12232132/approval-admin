import { askAI } from "@/api/deepseek"
import { useState } from "react"


export function useAIFill(onFill: (data: Record<string, string>) => void) {
    const [aiInput, setAiInput] = useState('')
    const [aiLoading, setAiLoading] = useState(false)

    const handleAIFill = async () => {
        if (!aiInput.trim()) return
        setAiLoading(true)
        try {
            const result = await askAI(aiInput)
            // AI 返回的工具调用结果
            if (result.tool_calls) {
                const args = JSON.parse(result.tool_calls[0].function.arguments)
                console.log('AI 填充数据:', args)
                onFill(args)
            }
        } catch (error) {
            console.error('AI 调用失败:', error)
        } finally {
            setAiLoading(false)
        }
    }

    return { aiInput, setAiInput, aiLoading, handleAIFill }
}