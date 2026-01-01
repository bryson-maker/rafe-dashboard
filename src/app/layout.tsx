import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RAFE Dashboard',
  description: 'Rise Local Automated Fulfillment Engine Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
