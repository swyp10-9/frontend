import LoginButton from './login-button';

export default function Login() {
  return (
    <div className='relative flex h-screen w-full flex-col items-center justify-center gap-10'>
      <div className='flex flex-col items-center justify-center gap-3'>
        <p className='ui-text-head-2'>축지법</p>
        <p className='text-center ui-text-body-2'>
          간편하게 로그인하고 <br /> 다양한 축제를 둘러보세요.
        </p>
      </div>
      <div className='flex flex-col items-center justify-center gap-4'>
        <LoginButton type='kakao' />
        <LoginButton type='not-login' />
        <p className='ui-text-body-2'>일부 기능이 제한됩니다.</p>
      </div>
      <p className='fixed bottom-10 text-center ui-text-caption text-gray-400'>
        가입 시 개인정보처리방침 및 이용약관에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}
