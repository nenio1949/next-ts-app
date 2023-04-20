/*
 * @Description: 枚举值配置
 * @Author: yong.li
 * @Date: 2022-01-21 16:03:03
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-20 10:09:02
 */

const enumConfig: EnumConfig = {
  /** 数据来源 */
  useCaseSources: [
    { value: 'indoor', label: '实验室' },
    { value: 'outdoor', label: '现场' }
  ],
  /** 用例状态（更新） */
  useCaseStates: [
    { value: 'natural', label: '正常' },
    { value: 'other', label: '其他' },
    { value: 'abandoned', label: '废弃' }
  ],
  /** 用例状态（查询） */
  useCaseSearchStates: [
    { value: 'natural', label: '正常' },
    { value: 'abandoned', label: '废弃' },
    { value: 'other', label: '其他' },
    { value: 'generating', label: '用例生成中' }
  ],

  /** 用例更新类型 */
  useCaseUpdateTypes: [
    { value: 'create', label: '新增' },
    { value: 'update', label: '变更' },
    { value: 'delete', label: '删除' }
  ],
  /** 用例属性 */
  useCaseAttributes: [
    { value: 'func', label: '功能项' },
    { value: 'data', label: '数据项' }
  ],
  /** 用例测试结果 */
  useCaseTestResults: [
    { value: 'pass', label: '通过' },
    { value: 'reject', label: '不通过' },
    { value: 'invalid', label: '不涉及' },
    { value: 'block', label: '阻塞' },
    { value: 'other', label: '其他' }
  ]
}

export default enumConfig
