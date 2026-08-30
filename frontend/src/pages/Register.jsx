import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { validateRegistration } from '../utils/validation';
import BrandMark from '../components/common/BrandMark';
import BrandName from '../components/common/BrandName';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const change = (field, value) => {
    setForm((current) => (
      field === 'password'
        ? { ...current, password: value, confirmPassword: value }
        : { ...current, [field]: value }
    ));
    setErrors((current) => ({ ...current, [field]: '', confirmPassword: '', form: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegistration(form);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);

    if (result.success) navigate('/');
    else setErrors({ form: result.message || 'Unable to create your account.' });
  };

  const inputClass = (field) => `w-full mt-2 h-12 px-4 bg-white border rounded-xl text-[#29424c] placeholder:text-[#9caab1] outline-none transition focus:ring-4 ${
    errors[field]
      ? 'border-red-400 focus:ring-red-100'
      : 'border-[#dfd0c8] focus:border-[#3d887b] focus:ring-[#3d887b]/10'
  }`;

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#f8f1ee] flex items-center justify-center px-6 py-4">
      <section className="w-full max-w-[536px] rounded-2xl border border-[#e4d8d2] bg-white px-8 py-6 shadow-[0_18px_45px_rgba(83,59,49,0.07)] sm:px-12">
        <div className="mb-5 flex items-center justify-center gap-3">
          <BrandMark className="h-10 w-10 drop-shadow-[0_7px_15px_rgba(61,136,123,0.25)]" />
          <BrandName />
        </div>

        <div className="mb-5 text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#29424c] sm:text-4xl">Track your job search.</h1>
        </div>

        <form onSubmit={submit} noValidate className="space-y-3">
          {errors.form && <p role="alert" className="text-sm text-red-600">{errors.form}</p>}

          <div>
            <label htmlFor="register-name" className="text-sm font-semibold text-[#29424c]">Full name *</label>
            <input id="register-name" autoComplete="name" value={form.name} onChange={(event) => change('name', event.target.value)} className={inputClass('name')} placeholder="Avery Morgan" />
            {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="register-email" className="text-sm font-semibold text-[#29424c]">Email address *</label>
            <input id="register-email" type="email" autoComplete="email" value={form.email} onChange={(event) => change('email', event.target.value)} className={inputClass('email')} placeholder="you@example.com" />
            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="register-password" className="text-sm font-semibold text-[#29424c]">Password *</label>
            <div className="relative">
              <input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={(event) => change('password', event.target.value)} className={`${inputClass('password')} pr-12`} placeholder="At least 8 characters" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-[calc(50%-0.5rem)] rounded-md p-1 text-[#718792] hover:bg-[#f8f1ee]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
          </div>

          <button disabled={loading} className="app-button flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Creating account…' : <>Create account <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#718792]">
          Already have an account? <Link to="/login" className="font-semibold text-[#3d887b] hover:text-[#327267]">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
