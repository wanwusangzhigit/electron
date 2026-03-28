// 文件路径: src/bridge/vue-web-component.ts

/**
 * 将 Vue 组件注册为 Web Component
 * 使得 Vue 组件可以在 React 中作为自定义元素使用
 */

import { defineCustomElement } from 'vue';
import PropertiesPanel from '../vue/components/panels/PropertiesPanel.vue';

// 注册属性面板为 Web Component
const PropertiesPanelElement = defineCustomElement(PropertiesPanel);
customElements.define('motioncraft-properties-panel', PropertiesPanelElement);

// 导出以便在 React 中使用
export const MotionCraftPropertiesPanel = 'motioncraft-properties-panel';

// 类型声明
declare global {
  interface HTMLElementTagNameMap {
    'motioncraft-properties-panel': HTMLElement & {
      layerId?: string | null;
      project?: any;
    };
  }
}
