import AppShell from '@/components/layout/AppShell'

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
