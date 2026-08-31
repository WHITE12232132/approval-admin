import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { useAIFill } from '@/hooks/useAIFill'
import {
  approvalFlowRegistry,
  getFlowConfig,
} from '@/store/machineFactory'
import type {
  ApprovalContext,
  ApprovalFlowConfig,
  FormFieldConfig,
} from '@/store/types'

function InputField({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  )
}

function SelectField({
  options,
  placeholder,
  value,
  onChange,
}: {
  options?: { label: string; value: string }[]
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <option value="">{placeholder || '请选择'}</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

function TextareaField({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <textarea
      placeholder={placeholder}
      rows={4}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  )
}

function DateField({
  value,
  onChange,
}: {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  )
}

function NumberField({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  )
}

function getFieldComponent(component: FormFieldConfig['component']) {
  switch (component) {
    case 'Select': return SelectField
    case 'Textarea': return TextareaField
    case 'DatePicker': return DateField
    case 'InputNumber': return NumberField
    default: return InputField
  }
}



function evaluateVisibleExpr(
  expr: string,
  triggerValue: string,
): boolean {
  const match = expr.match(/\$self\.value === "([^"]+)"/)
  if (match) {
    return triggerValue === match[1]
  }
  // 未知表达式默认显示
  return true
}

function isFieldVisible(
  fieldKey: string,
  formFields: FormFieldConfig[],
  formValues: Record<string, string>,
): boolean {
  for (const field of formFields) {
    if (field.reactions?.target === fieldKey && field.reactions.fulfill.state.visible) {
      const triggerValue = formValues[field.key] || ''
      return evaluateVisibleExpr(field.reactions.fulfill.state.visible, triggerValue)
    }
  }
  return true
}

function buildContextFromMapping(
  flowType: string,
  formValues: Record<string, string>,
  contextMapping: ApprovalFlowConfig['contextMapping'],
): Partial<ApprovalContext> {
  const ctx: Partial<ApprovalContext> = {
    type: flowType,
    approvalId: String(Date.now()),
  }

  for (const mapping of contextMapping) {
    const rawValue = formValues[mapping.formField] ?? ''
    if (mapping.transform === 'number') {
      ; (ctx as Record<string, unknown>)[mapping.contextField] = Number(rawValue) || 0
    } else {
      ; (ctx as Record<string, unknown>)[mapping.contextField] = rawValue
    }
  }

  return ctx
}


function initFormValues(config: ApprovalFlowConfig | undefined): Record<string, string> {
  if (!config) return {}

  const initialValues: Record<string, string> = {}
  for (const field of config.formFields) {
    if (field.defaultValue !== undefined) {
      initialValues[field.key] = String(field.defaultValue)
    }
  }
  return initialValues
}

export default function ApprovalCreate() {
  //审批类型对象转成键值对数组
  const flowEntries = Object.entries(approvalFlowRegistry)
  // 默认选中第一个流程
  const [selectedFlowType, setSelectedFlowType] = useState<string>(
    flowEntries[0]?.[0] ?? 'leave',
  )
  //获取某个审核类型的配置
  const currentConfig = getFlowConfig(selectedFlowType)
  // 获取默认值
  const [formValues, setFormValues] = useState<Record<string, string>>(
    () => initFormValues(currentConfig)
  )
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const convertRelativeDate = (dateStr: string): string => {
    if (!dateStr) return ''

    const today = new Date()
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

    // 直接是 yyyy-MM-dd 格式，直接返回
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr
    }

    // 处理相对日期
    const targetDate = new Date(today)

    if (dateStr === '今天') {
      // 保持今天
    } else if (dateStr === '明天') {
      targetDate.setDate(today.getDate() + 1)
    } else if (dateStr === '后天') {
      targetDate.setDate(today.getDate() + 2)
    } else if (dateStr === '昨天') {
      targetDate.setDate(today.getDate() - 1)
    } else if (dateStr === '前天') {
      targetDate.setDate(today.getDate() - 2)
    } else if (dateStr.startsWith('下周')) {
      // 下周三 → 下周的周三
      const weekdayStr = dateStr.slice(2)
      const targetWeekday = weekdays.indexOf(weekdayStr)
      if (targetWeekday !== -1) {
        const currentWeekday = today.getDay()
        let daysUntil = targetWeekday - currentWeekday
        if (daysUntil <= 0) daysUntil += 7
        daysUntil += 7 // 下周
        targetDate.setDate(today.getDate() + daysUntil)
      }
    } else if (dateStr.startsWith('这周') || dateStr.startsWith('本周')) {
      // 这周三 → 本周的周三
      const weekdayStr = dateStr.slice(2)
      const targetWeekday = weekdays.indexOf(weekdayStr)
      if (targetWeekday !== -1) {
        const currentWeekday = today.getDay()
        let daysUntil = targetWeekday - currentWeekday
        if (daysUntil < 0) daysUntil += 7
        targetDate.setDate(today.getDate() + daysUntil)
      }
    } else if (dateStr.match(/^周[一二三四五六日]$/)) {
      // 周三 → 最近的周三
      const targetWeekday = weekdays.indexOf(dateStr)
      if (targetWeekday !== -1) {
        const currentWeekday = today.getDay()
        let daysUntil = targetWeekday - currentWeekday
        if (daysUntil <= 0) daysUntil += 7
        targetDate.setDate(today.getDate() + daysUntil)
      }
    } else {
      // 无法解析，返回空字符串
      return ''
    }

    // 格式化为 yyyy-MM-dd
    const year = targetDate.getFullYear()
    const month = String(targetDate.getMonth() + 1).padStart(2, '0')
    const day = String(targetDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // AI 智能填表
  const { aiInput, setAiInput, aiLoading, handleAIFill } = useAIFill((data) => {
    if (data.approvalType) {
      // AI 返回中文类型名 → 查找匹配的 flowType
      for (const [key, cfg] of flowEntries) {
        if (cfg.shortLabel === data.approvalType || cfg.label === data.approvalType || key === data.approvalType) {
          setSelectedFlowType(key)
          break
        }
      }
    }

    // 处理日期字段，将相对日期转换为 yyyy-MM-dd 格式
    const processedData = { ...data }
    const dateFields = ['startDate', 'endDate', 'date']
    for (const field of dateFields) {
      if (processedData[field]) {
        processedData[field] = convertRelativeDate(processedData[field])
      }
    }

    setFormValues((prev) => ({ ...prev, ...processedData }))
  })

  /**
   * 验证单个字段
   * @returns 错误信息，无错误返回空字符串
   */
  const validateField = (field: FormFieldConfig, value: string): string => {
    const rules = field.rules
    if (!rules) return ''

    // 必填验证
    if (rules.required && (!value || value.trim() === '')) {
      return rules.requiredMessage || `${field.title}不能为空`
    }

    // 数字类型验证
    if (field.component === 'InputNumber' && value) {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        return `${field.title}必须是数字`
      }
      if (rules.min !== undefined && numValue < rules.min) {
        return `${field.title}不能小于${rules.min}`
      }
      if (rules.max !== undefined && numValue > rules.max) {
        return `${field.title}不能大于${rules.max}`
      }
    }

    // 字符串长度验证
    if (typeof value === 'string' && value) {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        return `${field.title}长度不能小于${rules.minLength}个字符`
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        return `${field.title}长度不能大于${rules.maxLength}个字符`
      }
    }

    // 正则表达式验证
    if (rules.pattern && value) {
      const regex = new RegExp(rules.pattern)
      if (!regex.test(value)) {
        return rules.patternMessage || `${field.title}格式不正确`
      }
    }

    return ''
  }

  /**
   * 验证所有表单字段
   * @returns 是否验证通过
   */
  const validateForm = (): boolean => {
    if (!currentConfig) return false

    const errors: Record<string, string> = {}
    let hasError = false

    for (const field of currentConfig.formFields) {
      // 跳过隐藏字段
      if (!isFieldVisible(field.key, currentConfig.formFields, formValues)) {
        continue
      }

      const error = validateField(field, formValues[field.key] || '')
      if (error) {
        errors[field.key] = error
        hasError = true
      }
    }

    setFormErrors(errors)
    return !hasError
  }

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    // 实时清除该字段的错误
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  /** 提交审批 → 构建上下文 → 跳转 detail */
  const handleSubmit = () => {
    if (!currentConfig) return

    // 先验证表单
    if (!validateForm()) {
      return
    }

    const ctx = buildContextFromMapping(
      selectedFlowType,
      formValues,
      currentConfig.contextMapping,
    )

    console.log('提交审批:', {
      flowType: selectedFlowType,
      context: ctx,
      formValues,
    })

    navigate('/approval/detail/new', {
      state: { flowType: selectedFlowType, context: ctx },
    })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* AI 智能填表 */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">🤖 AI 智能填表</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="描述你的审批需求，如：我下周三到周五要请年假回老家"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleAIFill}
            disabled={aiLoading}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg"
          >
            {aiLoading ? 'AI 思考中...' : 'AI 填表'}
          </button>
        </div>
      </div>
      {/* 表单 */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">发起审批</h2>

          {/* ===== 流程类型选择 — 从 registry 动态读取 ===== */}
          <div className="flex gap-2 mb-2">
            {flowEntries.map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedFlowType(key)
                  // 切换流程类型时重新初始化表单默认值
                  const newConfig = getFlowConfig(key)
                  setFormValues(initFormValues(newConfig))
                  setFormErrors({})
                }}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${selectedFlowType === key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          {/* 流程描述 */}
          {currentConfig && (
            <p className="text-xs text-gray-400 mb-4">{currentConfig.description}</p>
          )}

          {/* =====渲染表单且带默认值 ===== */}
          <div className="flex flex-col gap-4">
            {currentConfig?.formFields.map((field) => {
              // 联动规则：检查字段是否被隐藏，
              if (!isFieldVisible(field.key, currentConfig.formFields, formValues)) {
                return null
              }
              // 根据规则返回组件
              const Component = getFieldComponent(field.component)
              // 渲染表单组件
              return (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.title}
                    {field.rules?.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  <Component
                    placeholder={field.placeholder}
                    options={field.options}
                    value={formValues[field.key] || ''}
                    onChange={(
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
                      >,
                    ) => handleFieldChange(field.key, e.target.value)}
                  />
                  {formErrors[field.key] && (
                    <p className="mt-1 text-sm text-red-500">{formErrors[field.key]}</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => navigate('/approval')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              提交审批
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
