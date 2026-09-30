import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth, api } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { Eye, EyeOff } from 'lucide-react';

const tempEmailRegex = /yopmail|tempmail|guerrilla|10minutemail|mailinator|dropmail|disposable|trashmail|throwaway|fakemail|generator|mohmal|mailnesia|sharklasers/i;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
const passwordMessage = "Must contain uppercase, lowercase, number, and special character";

// Define schemas with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const resetPasswordSchema = z.object({
  code: z.string().min(4, { message: "Code must be at least 4 characters" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }).regex(passwordRegex, passwordMessage),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }).refine(val => !tempEmailRegex.test(val), "Temporary emails are not allowed"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).regex(passwordRegex, passwordMessage),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const LoginPage = () => {
  const { signIn, user } = useAuth();
  const { navigate } = useAppData();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // States: 'login', 'forgot', 'reset', 'register_options', 'register_email'
  const [view, setView] = useState<'login' | 'forgot' | 'reset' | 'register_options' | 'register_email'>('login');
  const [resetEmail, setResetEmail] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login Form
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors, isSubmitting: isLoggingIn } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Forgot Password Form
  const { register: registerForgot, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors, isSubmitting: isSendingCode } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Reset Password Form
  const { register: registerReset, handleSubmit: handleResetSubmit, formState: { errors: resetErrors, isSubmitting: isResetting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Register Form
  const { register: registerRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors, isSubmitting: isRegistering } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onRegister = async (data: RegisterFormValues) => {
    try {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      const { access_token } = res.data;
      await signIn(access_token, true);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  const onLogin = async (data: LoginFormValues) => {
    try {
      const res = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });
      
      const { access_token, user: loginUser } = res.data;
      
      await signIn(access_token);
      navigate(loginUser?.role === 'ADMIN' ? '/nerdsroom/admin/dashboard' : '/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    }
  };

  const onGoogleLogin = () => {
    toast.success('Redirecting to Google...');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    window.location.href = `${backendUrl}/auth/google`;
  };

  const onForgot = async (data: ForgotPasswordValues) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setResetEmail(data.email);
      setView('reset');
      toast.success(`Verification code sent to ${data.email}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send code');
    }
  };

  const onReset = async (data: ResetPasswordValues) => {
    try {
      await api.post('/auth/reset-password', {
        email: resetEmail,
        code: data.code,
        newPassword: data.newPassword
      });
      toast.success('Password reset successfully! Please login.');
      setView('login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid code or failed to reset');
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #9ca3af 1px, transparent 1px),
            linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 80%)',
        }}
      />
      
      {/* Soft Glow Overlays for aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-[800px] max-h-[800px] rounded-full bg-white/70 blur-[120px] z-0 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-nerdBlue/5 blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-nerdLime/5 blur-[100px] z-0 pointer-events-none" />

      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 z-10 relative">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-10">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-nerdDark tracking-tight mb-2">
                {view === 'login' && 'Welcome Back!'}
                {view === 'forgot' && 'Reset Password'}
                {view === 'reset' && 'Create New Password'}
                {view === 'register_options' && 'Create an Account'}
                {view === 'register_email' && 'Sign up with Email'}
              </h1>
              <p className="text-gray-500 text-sm">
                {view === 'login' && 'Sign in to access your Nerds Room account'}
                {view === 'forgot' && 'Enter your email to receive a reset code'}
                {view === 'reset' && `Enter the code sent to ${resetEmail}`}
                {view === 'register_options' && 'Join Nerds Room today'}
                {view === 'register_email' && 'Enter your details below'}
              </p>
            </div>

            {/* Login View */}
            {view === 'login' && (
              <>
                <button
                  onClick={onGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all mb-6"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <div className="relative flex items-center justify-center mb-6">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="bg-white px-4 text-sm text-gray-400 font-medium">or email</span>
                  <div className="border-t border-gray-200 w-full"></div>
                </div>

                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      {...registerLogin('email')}
                      className={`w-full px-4 py-3 rounded-xl border ${loginErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all`}
                      placeholder="you@example.com"
                    />
                    {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-bold text-gray-700">Password <span className="text-red-500">*</span></label>
                      <button 
                        type="button" 
                        onClick={() => setView('forgot')}
                        className="text-sm font-bold text-nerdBlue hover:text-nerdDark transition-colors"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...registerLogin('password')}
                        className={`w-full px-4 py-3 rounded-xl border ${loginErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-nerdBlue text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-lg hover:shadow-none disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoggingIn ? 'Signing In...' : 'Sign In'}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setView('register_options')} className="text-nerdBlue font-bold hover:underline">
                      Sign up
                    </button>
                  </p>
                </form>
              </>
            )}

            {/* Register Options View */}
            {view === 'register_options' && (
              <>
                <button
                  onClick={onGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all mb-4"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button
                  onClick={() => setView('register_email')}
                  className="w-full bg-nerdBlue text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-lg hover:shadow-none"
                >
                  Continue with Email
                </button>
                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="w-full text-gray-500 font-bold hover:text-nerdDark transition-colors mt-4"
                >
                  Back to Sign In
                </button>
              </>
            )}

            {/* Register Email View */}
            {view === 'register_email' && (
              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input
                    {...registerRegister('name')}
                    className={`w-full px-4 py-3 rounded-xl border ${registerErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all`}
                    placeholder="John Doe"
                  />
                  {registerErrors.name && <p className="text-red-500 text-xs mt-1">{registerErrors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    {...registerRegister('email')}
                    className={`w-full px-4 py-3 rounded-xl border ${registerErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all`}
                    placeholder="you@example.com"
                  />
                  {registerErrors.email && <p className="text-red-500 text-xs mt-1">{registerErrors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...registerRegister('password')}
                      className={`w-full px-4 py-3 rounded-xl border ${registerErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerErrors.password && <p className="text-red-500 text-xs mt-1">{registerErrors.password.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...registerRegister('confirmPassword')}
                      className={`w-full px-4 py-3 rounded-xl border ${registerErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{registerErrors.confirmPassword.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-nerdBlue text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-lg hover:shadow-none disabled:opacity-70 mt-4"
                >
                  {isRegistering ? 'Signing Up...' : 'Sign Up'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setView('register_options')}
                  className="w-full text-gray-500 font-bold hover:text-nerdDark transition-colors mt-2"
                >
                  Back
                </button>
              </form>
            )}

            {/* Forgot Password View */}
            {view === 'forgot' && (
              <form onSubmit={handleForgotSubmit(onForgot)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    {...registerForgot('email')}
                    className={`w-full px-4 py-3 rounded-xl border ${forgotErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all`}
                    placeholder="you@example.com"
                  />
                  {forgotErrors.email && <p className="text-red-500 text-xs mt-1">{forgotErrors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSendingCode}
                  className="w-full bg-nerdBlue text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-lg hover:shadow-none disabled:opacity-70"
                >
                  {isSendingCode ? 'Sending...' : 'Send Reset Code'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="w-full text-gray-500 font-bold hover:text-nerdDark transition-colors mt-2"
                >
                  Back to Sign In
                </button>
              </form>
            )}

            {/* Reset Password View */}
            {view === 'reset' && (
              <form onSubmit={handleResetSubmit(onReset)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Verification Code <span className="text-red-500">*</span></label>
                  <input
                    {...registerReset('code')}
                    autoComplete="off"
                    className={`w-full px-4 py-3 rounded-xl border ${resetErrors.code ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} tracking-widest focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all`}
                    placeholder="1234"
                  />
                  {resetErrors.code && <p className="text-red-500 text-xs mt-1">{resetErrors.code.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">New Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      {...registerReset('newPassword')}
                      className={`w-full px-4 py-3 rounded-xl border ${resetErrors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:ring-2 focus:ring-nerdBlue/20 focus:border-nerdBlue outline-none transition-all pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {resetErrors.newPassword && <p className="text-red-500 text-xs mt-1">{resetErrors.newPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full bg-nerdBlue text-white font-bold py-3.5 px-4 rounded-xl hover:bg-nerdLime hover:text-nerdBlue transition-all shadow-lg hover:shadow-none disabled:opacity-70"
                >
                  {isResetting ? 'Resetting...' : 'Reset Password'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="w-full text-gray-500 font-bold hover:text-nerdDark transition-colors mt-2"
                >
                  Cancel
                </button>
              </form>
            )}

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
