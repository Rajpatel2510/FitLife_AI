"use client"

declare module "next-themes" {
  export function useTheme(): {
    theme?: string
    setTheme: (theme: string) => void
    systemTheme?: string
    themes: string[]
  }

  export interface ThemeProviderProps {
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    children?: React.ReactNode
  }

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element
}
