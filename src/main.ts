import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/tailwindcss.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus, {
  locale: zhCn, // 设置中文语言
});
app.mount('#app');
