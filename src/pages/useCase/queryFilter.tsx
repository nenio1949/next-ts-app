import { Button, Form, Input, Select } from 'antd'
import { FilterPorps, Classification } from './type'
import { EnumConfigObj } from '@/config/enum'
import GConfig from '@/config/global'

const { Option } = Select
/** 筛选条件 */
const QueryFilter = (props: FilterPorps) => {
  const {
    classifications,
    condition,
    onCallbackParent,
    hasOperateAuth,
    setSelectedKeys,
    handleOperate,
    selectedKeys,
    loading
  } = props
  // 状态控制
  const [form] = Form.useForm()
  // 查询
  const handleSearch = () => {
    const newCondition = { ...condition, ...form.getFieldsValue() }
    setSelectedKeys && setSelectedKeys([])
    if (onCallbackParent) {
      onCallbackParent(newCondition)
    }
  }
  // 重置
  const handleReset = () => {
    setSelectedKeys && setSelectedKeys([])
    form.resetFields()
    const res = form.getFieldsValue()
    if (onCallbackParent)
      onCallbackParent({
        ...condition,
        ...res,
        state: ['natural', 'generating']
      })
  }
  return (
    <Form
      form={form}
      layout="inline"
      name="search"
      onFinish={handleSearch}
      initialValues={{
        state: ['natural', 'generating']
      }}
    >
      <Form.Item name="source" label="来源">
        <Select allowClear showSearch optionFilterProp="children" style={{ width: 150 }} placeholder="请选择来源">
          {GConfig.enum.useCaseSources.map((source: EnumConfigObj) => {
            return (
              <Option value={source.value} key={source.value}>
                {source.label}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
      <Form.Item name="classification_id" label="分类">
        <Select
          allowClear
          mode="multiple"
          style={{ minWidth: 210 }}
          options={classifications.map((val: Classification) => {
            return {
              value: val.id,
              label: val.name
            }
          })}
          placeholder="请选择分类"
        />
      </Form.Item>
      <Form.Item name="name" label="用例名称">
        <Input allowClear placeholder="请输入用例名称" />
      </Form.Item>
      <Form.Item name="state" label="状态">
        <Select mode="multiple" allowClear options={GConfig.enum.useCaseSearchStates} placeholder="请选择状态" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">查询</Button>
      </Form.Item>
      <Form.Item>
        <Button type="text" onClick={handleReset} htmlType="reset">
          重置
        </Button>
      </Form.Item>
      <Form.Item>
        {hasOperateAuth && (
          <Button disabled={loading} type="primary" onClick={() => handleOperate('create')}>
            新增用例版本
          </Button>
        )}
      </Form.Item>
      <Form.Item>
        <Button onClick={() => handleOperate('mergeRecord')}>用例合并记录</Button>
      </Form.Item>
      {!!selectedKeys.length && <Form.Item>已选择{selectedKeys.length}条将合并的用例</Form.Item>}
    </Form>
  )
}
export default QueryFilter
