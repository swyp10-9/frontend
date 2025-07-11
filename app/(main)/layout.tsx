import Nav from "@/layouts/nav"
import TabBar from "@/layouts/tab-bar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ maxWidth:'600px', minHeight:'100vh', width:'100%'}} className="flex flex-col">
            <Nav />
            <div className="flex-1">
                {children}
            </div>
            <TabBar />
        </div>
    )
}