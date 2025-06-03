"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userService } from "@/lib/user-service";

interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

const translateErrorMessage = (errorMessage: string): string => {
  if (errorMessage.includes("already exists")) {
    return "L'utilisateur existe déjà.";
  } else if (errorMessage.includes("invalid email")) {
    return "L'email est invalide.";
  } else if (errorMessage.includes("weak password")) {
    return "Le mot de passe est trop faible.";
  } else {
    return "Une erreur est survenue lors de l'inscription.";
  }
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserCreateRequest>({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await userService.register(formData);
      setSuccess("Compte créé avec succès!");
      setTimeout(() => {
        router.push("/connexion");
      }, 2000);
    } catch (err: any) {
      const userFriendlyMessage = translateErrorMessage(err.message);
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071f37] to-yellow-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header similaire à la home */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500 rounded-full shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
            <p className="text-sm sm:text-base text-yellow-500 font-semibold">
              Rejoignez notre plateforme et commencez à gérer vos accès
            </p>
          </div>
        </div>

        {/* Messages d'erreur / succès */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Formulaire dans une card */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="text-center">
            <CardDescription className="text-slate-600">
              Veuillez remplir les champs ci-dessous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Entrez votre nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Numéro de téléphone</Label>
                <Input
                  id="phone_number"
                  type="text"
                  placeholder="Entrez votre numéro de téléphone"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
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
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <p className="text-sm text-slate-600 w-full">
              Déjà inscrit ?{" "}
              <Link href="/connexion" className="text-yellow-500 hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
