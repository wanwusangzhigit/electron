// 文件路径: src/vue/main.ts

/**
 * Vue 入口 - 用于 Web Component 注册
 * 注意：实际注册在 bridge/vue-web-component.ts 中进行
 */

import { createPinia } from 'pinia';

// 创建 Pinia 实例（供 Vue 组件内部使用）
export const pinia = createPinia();

// 导出 store
export { useVueProjectStore } from './stores/useVueProjectStore';
export { useVueLayerStore } from './stores/useVueLayerStore';
