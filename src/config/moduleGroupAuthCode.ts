/*
 * @Description:模块权限分组
 * @Author: yong.li
 * @Date: 2022-03-17 15:17:43
 * @LastEditors: yong.li
 * @LastEditTime: 2023-03-07 16:40:28
 */

const moduleGroupAuthCodeConfig: { [key: string]: string[] } = {
  /** 基础用例库 */
  baseUseCase: ['JCYLK-EDIT'],

  /** 测试表格模板 */
  testTableTemplate: ['CSBGMB-EDIT'],

  /** 实验室测试 */
  // 用例管理
  laboratoryUseCase: ['SYSCS-YLGL-EDIT'],
  // 工程版本管理
  laboratoryProjectVersion: ['SYSCS-GCBB-EDIT'],
  // 实验室测试表格管理
  laboratoryTestTable: ['SYSCS-CSBG-EDIT'],
  // 实验室表格测试
  laboratoryTableTest: ['SYSCS-CSBG-TEST'],

  /** 缺陷管理 */
  defect: ['SYSCS-QXGL-TEST', 'GJWZ-EDIT', 'GJWZ-ADD'],

  /** 测试序列模板 */
  testSequenceTemplate: ['CSXLMB-EDIT'],
  /** 现场测试测试表格编辑权限 */
  spotTestTable: ['XCCS-CSBG-EDIT'],
  /** 现场测试工程版本管理权限 */
  spotProjectVersion: ['XCCS-GCBB-EDIT'],
  // 现场测试用例
  spotUseCase: ['XCCS-YLGL-EDIT'],
  // 现场测试用例
  testSequence: ['XCCS-CSXL-EDIT'],

  /** 控制台 */
  // 权限配置
  settingAuth: ['QXGL-EDIT'],
  // 项目人员
  settingProjectPerson: ['QXGL-XMRY-EDIT']
}

export default moduleGroupAuthCodeConfig
