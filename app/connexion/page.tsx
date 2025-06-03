"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { authService } from "@/lib/auth-service"; // Remplace par ton service réel

interface LoginRequest {
  username: string;
  password: string;
}

const translateErrorMessage = (errorMessage: string): string => {
  if (errorMessage.includes("invalid credentials")) {
    return "Email ou mot de passe incorrect.";
  } else {
    return "Une erreur est survenue lors de la connexion.";
  }
};

export default function ConnexionPage() {
  const [formData, setFormData] = useState<LoginRequest>({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(formData); 
      router.push("/"); 
    } catch (err: any) {
      const msg = translateErrorMessage(err.message);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-orange-600 rounded-full shadow-lg">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
            <p className="text-sm sm:text-base text-orange-600 font-semibold">
              Connectez-vous à votre compte
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="text-center">
            <CardDescription className="text-slate-600">
              Entrez vos identifiants pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-slate-600 w-full">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-orange-600 hover:underline font-medium">
                Créer un compte
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
