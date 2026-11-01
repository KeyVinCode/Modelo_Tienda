import { useState, type FormEvent } from "react";
import { FiAlertCircle, FiEye, FiEyeOff, FiLock, FiShoppingBag, FiUser } from "react-icons/fi";
import { iniciarSesion, type Usuario } from "../lib/auth";

interface Props {
  onEntrar: (usuario: Usuario) => void;
}

const MAX_INTENTOS = 5;
const ESPERA_MS = 30_000;

const campo =
  "block w-full rounded-xl border border-field-line bg-field py-2.5 pl-10 text-ink focus:outline-2 focus:outline-accent";

export default function Login({ onEntrar }: Props) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(0);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (Date.now() < bloqueadoHasta) {
      return setError("Demasiados intentos. Espera 30 segundos y vuelve a probar.");
    }
    if (!usuario.trim() || !clave) return setError("Escribe tu usuario y tu contraseña");

    setError("");
    setCargando(true);
    const encontrado = await iniciarSesion(usuario, clave);
    setCargando(false);

    if (encontrado) return onEntrar(encontrado);

    const total = intentos + 1;
    setClave("");
    if (total >= MAX_INTENTOS) {
      setIntentos(0);
      setBloqueadoHasta(Date.now() + ESPERA_MS);
      setError("Demasiados intentos. Espera 30 segundos y vuelve a probar.");
    } else {
      setIntentos(total);
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <div className="w-full max-w-sm rounded-3xl border-t-[6px] border-accent bg-base p-7 shadow-neu">
        <div className="btn-primary mb-4 grid size-12 place-items-center rounded-2xl">
          <FiShoppingBag size={22} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-muted">Ingresa para administrar el catálogo y las ventas de tu tienda.</p>

        <form onSubmit={enviar} className="mt-6 space-y-4" noValidate>
          <label className="block text-sm text-muted">
            Usuario
            <span className="relative mt-1 block">
              <FiUser className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
              <input
                className={`${campo} pr-3.5`}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </span>
          </label>

          <label className="block text-sm text-muted">
            Contraseña
            <span className="relative mt-1 block">
              <FiLock className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
              <input
                className={`${campo} pr-11`}
                type={verClave ? "text" : "password"}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setVerClave((v) => !v)}
                aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={verClave}
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink"
              >
                {verClave ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </span>
          </label>

          {error && (
            <p role="alert" className="flex items-start gap-2 text-sm font-medium text-danger">
              <FiAlertCircle className="mt-0.5 shrink-0" size={16} /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="btn-primary w-full rounded-xl px-4 py-2.5 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-5 rounded-2xl p-3 text-xs text-muted shadow-neu-in">
          Acceso de prueba para la muestra: usuario <strong className="text-ink">admin</strong> y contraseña{" "}
          <strong className="text-ink">demo1234</strong>.
        </p>
      </div>
    </main>
  );
}
