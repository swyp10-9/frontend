import LoginButton from "./login-button";

export default function Login() {
    return (
        <div className="h-screen border flex flex-col w-full items-center justify-center">
            <h1>축지법</h1>
            <h4 className="text-center">간편하게 로그인하고 <br/> 다양한 축제를 둘러보세요.</h4>
            <LoginButton type='kakao' />
            <LoginButton type='not-login' />
        </div>
    )
}