import Link from "next/link";

export default function Nav() {
    return (
        <div className="flex items-center justify-between w-full">
            <h1>축지법</h1>
            <Link href="/mypage">
                <span>마이페이지</span>
            </Link>
        </div>
    )
}