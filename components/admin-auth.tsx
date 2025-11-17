'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'uppsala2024';

    if (username === adminUsername && password === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true') {
    if (!isAuthenticated) {
      setIsAuthenticated(true);
    }
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="bg-card border border-primary/20 rounded-lg p-8 neon-border">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
            <Lock className="text-primary" size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">Panel de Administración</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full neon-glow">
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
