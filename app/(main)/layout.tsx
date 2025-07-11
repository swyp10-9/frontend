import TabBar from "@/layouts/tab-bar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ maxWidth:'720px', minHeight:'100vh', width:'100%'}} className="flex flex-col">
            <div className="flex-1">
                {children}
            </div>
            <TabBar />
        </div>
    )
}