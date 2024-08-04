import type { ReactNode } from "react"

interface SettingsCardProps {
    children: ReactNode
}

export default function SettingsCard({ children }: SettingsCardProps) {
    return (
        <>
            {children}
        </>
    )
}

export function SettingsCardHeader({ children }: SettingsCardProps) {
    return (
        <>
            {children}
        </>
    )
}

export function SettingsCardDescription({ children }: SettingsCardProps) {
    return (
        <>
            {children}
        </>
    )
}

export function SettingsCardContent({ children }: SettingsCardProps) {
    return (
        <>
            {children}
        </>
    )
}

export function SettingsCardFooter({ children }: SettingsCardProps) {
    return (
        <>
            {children}
        </>
    )
}
