import Link from "next/link";

export default function TabBar() {
    const LinkClassName = 'flex flex-col items-center gap-px'
    return (
            <div className="flex items-center justify-center gap-2 w-full" style={{borderTop:'2px solid red'}}>
                <Link href="/" className={LinkClassName}>
                    <span>지도 보기</span>
                </Link>
                <Link href="/calendar" className={LinkClassName}>
                    <span>달력 보기</span>
                </Link>
                <Link href="/month-festival" className={LinkClassName}>
                    <span>이달의 축제</span>
                </Link>
                <Link href="/customized" className={LinkClassName}>
                    <span>맞춤 축제</span>
                </Link>
            </div>
    )
}