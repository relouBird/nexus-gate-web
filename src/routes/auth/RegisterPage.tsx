// pages/auth/RegisterPage.tsx
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useSeoHead } from "@/composables/useSeoHead";
import { pause } from "@/constants";
import {
  Field,
  AuthInput,
  PasswordInput,
  PasswordStrength,
  SubmitButton,
  AuthDivider,
} from "@/components/auth/AuthFormparts";
import { StepIndicator } from "@/components/auth/AuthRegisterparts";
import {
  ChevronLeft,
  ChevronRight,
  Envelope1,
  ErrorCircle1,
  User2,
  UserMultiple4,
} from "@tailgrids/icons";

// ─── Types ────────────────────────────────────────────────────

interface FormState {
  teamName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  teamName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  global?: string;
}

// ─── Validation ───────────────────────────────────────────────

function validate(form: FormState, step: 1 | 2): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!form.teamName.trim()) {
      errors.teamName = "Le nom d'équipe est requis.";
    } else if (form.teamName.trim().length < 2) {
      errors.teamName = "Minimum 2 caractères.";
    }

    if (!form.username.trim()) {
      errors.username = "Le nom d'utilisateur est requis.";
    } else if (form.username.trim().length < 2) {
      errors.username = "Minimum 2 caractères.";
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(form.username)) {
      errors.username = "Lettres, chiffres, _ . - uniquement.";
    }
  }

  if (step === 2) {
    if (!form.email.trim()) {
      errors.email = "L'adresse email est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format d'email invalide.";
    }

    if (!form.password) {
      errors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 8) {
      errors.password = "Minimum 8 caractères.";
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "Confirmez votre mot de passe.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
  }

  return errors;
}

// ─── Page ─────────────────────────────────────────────────────

export default function RegisterPage() {
  useSeoHead({
    title: "Créer un compte",
    subtitle: "Créez votre équipe NexusGate",
    forcePrefix: true,
  });

  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>({
    teamName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormState, boolean>>
  >({});

  function handleChange(field: keyof FormState, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      const nextErrors = validate(next, step);
      setErrors((prev) => ({
        ...prev,
        [field]: nextErrors[field],
        global: undefined,
      }));
    }
  }

  function handleBlur(field: keyof FormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validate(form, step);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  }

  // Étape 1 → 2
  function handleNextStep(e: FormEvent) {
    e.preventDefault();
    setTouched({ teamName: true, username: true });
    const stepErrors = validate(form, 1);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep(2);
  }

  // Soumission finale
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });
    const stepErrors = validate(form, 2);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // TODO : remplacer par authClient.register({
      //   teamName: form.teamName,
      //   username: form.username,
      //   email: form.email,
      //   password: form.password,
      // })
      // → POST /auth/team/register
      await pause(2500);
      navigate("/auth/login");
    } catch {
      setErrors({
        global:
          "Une erreur est survenue lors de la création du compte. Réessayez.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Slug preview : ce que le backend va générer
  const teamSlug = form.teamName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="flex flex-col gap-7">
      {/* ── En-tête ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-title-50 tracking-tight">
          Créer votre équipe
        </h1>
        <p className="text-sm text-foreground-soft-500">
          Un compte CREATOR et une équipe, en une seule étape.
        </p>
      </div>

      {/* ── Stepper ── */}
      <StepIndicator current={step} />

      {/* ── Erreur globale ── */}
      {errors.global && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-error-200 bg-error-50 px-4 py-3"
        >
          <ErrorCircle1 className="w-5 h-5 text-error-500" />
          <p className="text-sm text-error-600">{errors.global}</p>
        </div>
      )}

      {/* ── Step 1 : Équipe & nom d'utilisateur ── */}
      {step === 1 && (
        <form
          onSubmit={handleNextStep}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <Field
              label="Nom de l'équipe"
              htmlFor="teamName"
              error={errors.teamName}
            >
              <AuthInput
                id="teamName"
                type="text"
                name="teamName"
                placeholder="ex: TechCorp"
                autoComplete="organization"
                value={form.teamName}
                onChange={(e) => handleChange("teamName", e.target.value)}
                onBlur={() => handleBlur("teamName")}
                hasError={!!errors.teamName}
                leftIcon={<UserMultiple4 className="w-5 h-5" />}
              />
              {/* Slug preview */}
              {teamSlug && (
                <p className="text-xs text-foreground-soft-500/50 font-mono -mt-0.5">
                  nexusgate.io/
                  <span className="text-primary-500">{teamSlug}</span>
                  /…
                </p>
              )}
            </Field>

            <AuthDivider label="Votre compte administrateur" />

            <Field
              label="Nom d'utilisateur"
              htmlFor="username"
              error={errors.username}
            >
              <AuthInput
                id="username"
                type="text"
                name="username"
                placeholder="ex: alice_martin"
                autoComplete="username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                hasError={!!errors.username}
                leftIcon={<User2 className="w-5 h-5" />}
              />
            </Field>
          </div>

          <SubmitButton
            loading={false}
            label="Continuer"
            rightIcon={<ChevronRight className="w-5 h-5" />}
            loadingLabel=""
          />
        </form>
      )}

      {/* ── Step 2 : Email & mot de passe ── */}
      {step === 2 && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <Field label="Adresse email" htmlFor="email" error={errors.email}>
              <AuthInput
                id="email"
                type="email"
                name="email"
                placeholder="alice@techcorp.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                hasError={!!errors.email}
                leftIcon={<Envelope1 className="w-5 h-5" />}
              />
            </Field>

            <Field
              label="Mot de passe"
              htmlFor="password"
              error={errors.password}
            >
              <PasswordInput
                id="password"
                name="password"
                placeholder="Minimum 8 caractères"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                hasError={!!errors.password}
              />
              <PasswordStrength password={form.password} />
            </Field>

            <Field
              label="Confirmer le mot de passe"
              htmlFor="confirmPassword"
              error={errors.confirmPassword}
            >
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Répétez le mot de passe"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                hasError={!!errors.confirmPassword}
              />
            </Field>
          </div>

          {/* Recap équipe */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 border border-primary-100">
            <svg
              viewBox="0 0 14 14"
              fill="none"
              className="w-3.5 h-3.5 text-primary-500 shrink-0"
              aria-hidden="true"
            >
              <circle
                cx="7"
                cy="7"
                r="6"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M5 7l1.5 1.5L9 5.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xs text-primary-700">
              Équipe <span className="font-semibold">{form.teamName}</span>
              {" · "}Compte CREATOR pour{" "}
              <span className="font-semibold font-mono">{form.username}</span>
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="ml-auto text-xs text-primary-500 hover:text-primary-700 underline underline-offset-2 shrink-0"
            >
              Modifier
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <SubmitButton
              loading={loading}
              label="Créer le compte"
              loadingLabel="Création en cours..."
              rightIcon={<ChevronRight className="w-5 h-5" />}
            />
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="w-full flex justify-center items-center gap-1.5 text-sm text-foreground-soft-500 hover:text-title-50 transition-colors disabled:opacity-40 py-1"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
          </div>
        </form>
      )}

      {/* ── Footer ── */}
      <p className="text-center text-sm text-foreground-soft-500">
        Déjà un compte ?{" "}
        <Link
          to="/auth/login"
          className="text-primary-500 font-medium hover:text-primary-700 transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
