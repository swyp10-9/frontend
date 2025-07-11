import TabBar from "@/layouts/tab-bar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            {children}
            <TabBar />
        </div>
    )
}