import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../App';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  const burgerizzLogoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4QAAAF+CAMAAADAGB5LAAAAJ1BMVEX////MAP8lAP8A//8A1f9JMf8oAP8AVf8ASv8ALf+hxv8AXv/s9f+ch38sAAACBUlEQVR42u3YMRGAMBQDwUDgH/23LYQEC2Sk6b3eYgAAAAAAAAAAAAAAAAAAAAAAAMA3sZc88qjNl56U4c0KP99i/f13r/TmvT93lK/56vT698GLhGHDsGH8yYBhwrBh2DAgDBsGDcOGAQGGYcOwYdgwIIwYNgwbhowBYdgwbhg2DIgwhg3DhgHDBGEBw4ZhwwDDgDDBsGHcMGwYEMaEYcO4YcAAYdgwbhg2DBjCgGHDEADCsGHcMGwYEMyEYcO4YcAYECYMm4YNA4YxYdgwbhg2DIgwhg3DhgHDgDBsGDcMGwYEMiYMm4YNA4YwYdgwbhg2DIgwhg3DhgHDgDBsGDcMGwYEMoYNgwbhwwDDgDBsGDcMGwYEMobL/n4/39/LwH9bDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADY4y0/dzDCe+dDGwAAAABJRU5ErkJggg==";

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${burgerizzLogoBase64}')` }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            تسجيل الدخول الى نظام بيرغرايز
          </h1>
          <p className="font-bold text-red-600 text-3xl mt-2">
            فرع سيتي مول
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center font-semibold">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
