"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, QrCode, Smartphone, Users, ArrowRight, Star, Menu, X } from 'lucide-react';

export default function WelqoLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    router.push('/connexion');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR Codes Sécurisés",
      description: "Générez des codes QR uniques et temporaires pour vos invités"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité Maximale",
      description: "Chiffrement de bout en bout et contrôle d'accès avancé"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Interface Web",
      description: "Plateforme responsive optimisée pour tous les appareils"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Gestion Multi-Utilisateurs",
      description: "Gérez plusieurs résidences et utilisateurs en un seul endroit"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dupont",
      role: "Propriétaire",
      comment: "Une solution révolutionnaire pour gérer l'accès à ma résidence !",
      rating: 5
    },
    {
      name: "Jean Martin",
      role: "Gestionnaire Immobilier",
      comment: "Interface intuitive et sécurité de premier plan.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#082038' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation - Fixed with Transparent Background */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="/Welqo.png"
                alt="Welqo Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl shadow-xl border-2 border-yellow-400/20"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-md -z-10"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl tracking-tight">
                Welqo
              </h1>
              <p className="text-yellow-400 text-xs sm:text-sm md:text-base font-semibold tracking-wide">
                Genetics-Services
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#features" className="text-white hover:text-yellow-400 transition-colors text-sm xl:text-base">Fonctionnalités</a>
            <a href="#about" className="text-white hover:text-yellow-400 transition-colors text-sm xl:text-base">À propos</a>
            <a href="#contact" className="text-white hover:text-yellow-400 transition-colors text-sm xl:text-base">Contact</a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 mx-3 sm:mx-4 md:mx-6 rounded-b-lg">
            <div className="px-4 sm:px-6 py-4 space-y-3 sm:space-y-4">
              <a href="#features" className="block text-white hover:text-yellow-400 transition-colors text-sm sm:text-base py-2">Fonctionnalités</a>
              <a href="#about" className="block text-white hover:text-yellow-400 transition-colors text-sm sm:text-base py-2">À propos</a>
              <a href="#contact" className="block text-white hover:text-yellow-400 transition-colors text-sm sm:text-base py-2">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content with Padding to Avoid Overlap */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="relative px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="transform transition-transform duration-1000" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
                Contrôle d'Accès
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Résidentiel
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Gérez l'accès à votre résidence avec des QR codes sécurisés.
                <span className="text-yellow-400 font-semibold block sm:inline"> Simple, rapide et ultra-sécurisé.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-14 md:mb-16 px-4">
                <button
                  onClick={handleSignUp}
                  className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 min-w-[200px]"
                >
                  <span>Inscription</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                </button>
                <button
                  onClick={handleLogin}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-yellow-400 text-yellow-400 font-bold text-base sm:text-lg rounded-xl hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300 min-w-[200px] backdrop-blur-sm"
                >
                  Connexion
                </button>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-slate-400 px-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-sm sm:text-base">100% Sécurisé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <span className="text-sm sm:text-base">1000+ Utilisateurs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span className="text-sm sm:text-base">4.9/5 Étoiles</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-14 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
                Fonctionnalités
                <span className="text-yellow-400"> Avancées</span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto px-4">
                Découvrez comment Welqo révolutionne la gestion d'accès résidentiel
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 sm:p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-yellow-400/50 transition-all duration-500 hover:transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0">
                      {React.cloneElement(feature.icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center sm:text-left">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base text-center sm:text-left">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 sm:mb-14 md:mb-16 px-2">
              Ce que disent nos
              <span className="text-yellow-400"> utilisateurs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-yellow-400/30 transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 sm:mb-6 text-base sm:text-lg italic">"{testimonial.comment}"</p>
                  <div>
                    <h4 className="text-white font-bold text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-yellow-400 text-sm sm:text-base">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-10 md:p-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl border border-yellow-400/30">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2">
                Prêt à commencer ?
              </h2>
              <p className="text-lg sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Rejoignez des milliers d'utilisateurs qui font confiance à Welqo pour sécuriser leur résidence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <button
                  onClick={handleSignUp}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Commencer Gratuitement
                </button>
                <button
                  onClick={handleLogin}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-bold text-base sm:text-lg rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-6 md:gap-0">
              <div className="text-slate-400 text-center">
                <p className="text-sm sm:text-base">&copy; 2025 Welqo. Tous droits réservés.</p>
                <p className="text-lg sm:text-xl text-yellow-400 font-bold">Genetics-Services</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm">Contrôle d'accès résidentiel nouvelle génération</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
