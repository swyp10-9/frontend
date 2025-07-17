import Link from "next/link";

export default function MyPage() {
    return (
        <div>
            <h1>MyPage</h1>
            <Link href="/login">
                <span>로그인</span>
            </Link>
        </div>
    )
}