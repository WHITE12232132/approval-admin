import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { createForm } from '@formily/core'
import { FormProvider } from '@formily/react'
import { useAIFill } from '@/hooks/useAIFill'


const approvalTypes = ['请假', '报销', '采购', '通用']

interface SchemaField {
  type: string
  title: string
  enum?: { label: string; value: string }[]
  'x-component': string
  'x-component-props'?: Record<string, string>
  'x-reactions'?: {
    target: string
    fulfill: {
      state: {
        visible: string
      }
    }
  }
}

interface Schema {
  type: string
  properties: Record<string, SchemaField>
}

const formSchemas: Record<string, Schema> = {
  请假: {
    type: 'object',
    properties: {
      leaveType: {
        type: 'string',
        title: '请假类型',
        enum: [
          { label: '事假', value: '事假' },
          { label: '病假', value: '病假' },
          { label: '年假', value: '年假' },
        ],
        'x-component': 'Select',
        'x-component-props': { placeholder: '请选择请假类型' },
        'x-reactions': {
          target: 'diagnosis',
          fulfill: {
            state: {
              visible: '{{$self.value === "病假"}}',
            },
          },
        },
      },
      startDate: {
        type: 'string',
        title: '开始时间',
        'x-component': 'DatePicker',
      },
      endDate: {
        type: 'string',
        title: '结束时间',
        'x-component': 'DatePicker',
      },
      reason: {
        type: 'string',
        title: '请假事由',
        'x-component': 'Input.TextArea',
        'x-component-props': { placeholder: '请输入请假事由' },
      },
      diagnosis: {
        type: 'string',
        title: '诊断证明',
        'x-component': 'Input',
        'x-component-props': { placeholder: '请上传诊断证明' },
      },
    },
  },
  报销: {
    type: 'object',
    properties: {
      amount: {
        type: 'number',
        title: '报销金额',
        'x-component': 'InputNumber',
        'x-component-props': { placeholder: '请输入金额' },
      },
      reason: {
        type: 'string',
        title: '报销事由',
        'x-component': 'Input.TextArea',
      },
    },
  },
  采购: {
    type: 'object',
    properties: {
      itemName: {
        type: 'string',
        title: '采购物品',
        'x-component': 'Input',
        'x-component-props': { placeholder: '请输入物品名称' },
      },
      quantity: {
        type: 'number',
        title: '数量',
        'x-component': 'InputNumber',
      },
      reason: {
        type: 'string',
        title: '采购事由',
        'x-component': 'Input.TextArea',
      },
    },
  },
  通用: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: '标题',
        'x-component': 'Input',
        'x-component-props': { placeholder: '请输入标题' },
      },
      description: {
        type: 'string',
        title: '描述',
        'x-component': 'Input.TextArea',
      },
    },
  },
}

function InputField({ placeholder, value, onChange }: { placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
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

function SelectField({ enum: options, placeholder, value, onChange }: { enum?: { label: string; value: string }[]; placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <option value="">{placeholder || '请选择'}</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

function TextareaField({ placeholder, value, onChange }: { placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) {
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

function DateField({ value, onChange }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  )
}

function NumberField({ placeholder, value, onChange }: { placeholder?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
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

function getComponent(componentName: string) {
  switch (componentName) {
    case 'Select': return SelectField
    case 'Input.TextArea': return TextareaField
    case 'DatePicker': return DateField
    case 'InputNumber': return NumberField
    default: return InputField
  }
}

export default function ApprovalCreate() {
  const [selectedType, setSelectedType] = useState('请假')
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const { aiInput, setAiInput, aiLoading, handleAIFill } = useAIFill((data) => {
    if (data.approvalType) {
      setSelectedType(data.approvalType)
    }
    // AI 返回数据后，更新表单
    setFormValues((prev) => ({ ...prev, ...data }))
  })
  

  const navigate = useNavigate()

  const form = createForm({
    initialValues: {},
  })

  const currentSchema = formSchemas[selectedType]

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const isFieldVisible = (schema: SchemaField) => {
    // 如果字段没有 x-reactions，默认显示
    if (!schema['x-reactions']) return true

    // 如果字段有 x-reactions，说明它是触发者，应该显示
    // 被控制的字段（如 diagnosis）没有 x-reactions，会在下面的逻辑中处理
    return true
  }

  // 检查字段是否被其他字段的 reactions 控制
  const isFieldControlled = (key: string) => {
    // 遍历当前表单所有字段，找到控制当前字段的 reactions
    const properties = currentSchema?.properties || {}
    for (const fieldKey of Object.keys(properties)) {
      const field = properties[fieldKey]
      if (field['x-reactions']?.target === key) {
        // 找到控制当前字段的触发者
        const triggerValue = formValues[fieldKey]
        const visibleExpr = field['x-reactions'].fulfill.state.visible
        const match = visibleExpr.match(/\$self\.value === "([^"]+)"/)
        if (match) {
          return triggerValue === match[1]
        }
      }
    }
    return true
  }

  return (

    <div className="flex flex-col gap-4 w-full">
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
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">发起审批</h2>

          <div className="flex gap-2 mb-6">
            {approvalTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${selectedType === type
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <FormProvider form={form}>
            <div className="flex flex-col gap-4">
              {Object.entries(currentSchema?.properties || {}).map(([key, schema]) => {
                if (!isFieldVisible(schema)) return null
                if (!isFieldControlled(key)) return null
                const Component = getComponent(schema['x-component'])
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {schema.title}
                    </label>
                    <Component
                      {...schema['x-component-props']}
                      enum={schema['enum']}
                      value={formValues[key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
                        handleFieldChange(key, e.target.value)
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </FormProvider>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => navigate('/approval')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
            >
              取消
            </button>
            <button
              onClick={() => {
                console.log('提交表单:', form.values)
                navigate('/approval')
              }}
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
