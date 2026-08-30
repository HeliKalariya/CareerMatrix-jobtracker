import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { validateLogin } from '../utils/validation';
import BrandMark from '../components/common/BrandMark';
import BrandName from '../components/common/BrandName';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const change = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '', form: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(form);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    const result = await login(form.email.trim(), form.password);
    setLoading(false);

    if (result.success) navigate('/');
    else setErrors({ form: result.message || 'Unable to sign in.' });
  };

  const inputClass = (field) => `w-full mt-2 h-12 px-4 bg-white border rounded-xl text-[#29424c] placeholder:text-[#9caab1] outline-none transition focus:ring-4 ${
    errors[field]
      ? 'border-red-400 focus:ring-red-100'
      : 'border-[#dfd0c8] focus:border-[#3d887b] focus:ring-[#3d887b]/10'
  }`;

  return (
    <main className="min-h-screen bg-[#f8f1ee] flex items-center justify-center px-6 py-8">
      <section className="w-full max-w-[480px] rounded-2xl border border-[#e4d8d2] bg-white px-8 py-8 shadow-[0_18px_45px_rgba(83,59,49,0.07)] sm:px-10">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <BrandMark className="h-9 w-9 drop-shadow-[0_7px_15px_rgba(61,136,123,0.25)]" />
          <BrandName className="text-lg" />
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#29424c]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#718792]">Your next best move is waiting.</p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-5">
          {errors.form && <p role="alert" className="text-sm text-red-600">{errors.form}</p>}

          <div>
            <label htmlFor="login-email" className="text-sm font-semibold text-[#29424c]">Email address *</label>
            <input id="login-email" type="email" autoComplete="email" value={form.email} onChange={(event) => change('email', event.target.value)} className={inputClass('email')} placeholder="you@example.com" />
            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm font-semibold text-[#29424c]">Password *</label>
            <div className="relative">
              <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={(event) => change('password', event.target.value)} className={`${inputClass('password')} pr-12`} placeholder="At least 8 characters" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-[calc(50%-0.5rem)] rounded-md p-1 text-[#718792] hover:bg-[#f8f1ee]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
          </div>

          <button disabled={loading} className="app-button flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Signing in…' : <>Sign in <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#718792]">
          New to CareerMatrix? <Link to="/register" className="font-semibold text-[#3d887b] hover:text-[#327267]">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
