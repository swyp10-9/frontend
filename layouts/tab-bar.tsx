import Link from "next/link";

export default function TabBar() {
    const LinkClassName = 'flex flex-col items-center gap-px'
    return (
        <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-800">
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