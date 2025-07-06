import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { componentTagger } from "lovable-tagger"
import tsconfigPaths from 'vite-tsconfig-paths' // <-- 1. أضفنا سطر الاستيراد هنا

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tsconfigPaths(), // <-- 2. الإضافة موجودة هنا بشكل صحيح
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  // 3. قمنا بحذف قسم resolve.alias القديم لأنه لم يعد مطلوباً
}))
