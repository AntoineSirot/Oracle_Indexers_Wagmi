import '@rainbow-me/rainbowkit/styles.css'
import { Providers } from './providers'

// import global.css here
import './../../global.css'

export const metadata = {
  title: 'wagmi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
