import { Sidebar } from '@/components/layout/sidebar'
import { MainContent } from '@/components/layout/main-content'

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <MainContent />
    </div>
  )
}
