'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
    const pathname = usePathname()
    const LinkClassName = 'flex flex-col items-center gap-px w-full'
    const borderClassName = 'border-t-2 border-t-black-500'
    return (
            <div className="flex items-center justify-between w-full">
                <Link href="/" className={`${LinkClassName} ${pathname === '/' ? borderClassName : ''}`}>
                    <span>지도 보기</span>
                </Link>
                <Link href="/calendar" className={`${LinkClassName} ${pathname === '/calendar' ? borderClassName : ''}`}>
                    <span>달력 보기</span>
                </Link>
                <Link href="/month-festival" className={`${LinkClassName} ${pathname === '/month-festival' ? borderClassName : ''}`}>
                    <span>이달의 축제</span>
                </Link>
                <Link href="/customized" className={`${LinkClassName} ${pathname === '/customized' ? borderClassName : ''}`}>
                    <span>맞춤 축제</span>
                </Link>
            </div>
    )
}