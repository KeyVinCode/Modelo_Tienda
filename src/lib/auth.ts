export type Rol = "dueño" | "empleado";

export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  rol: Rol;
}


const CUENTAS = [
  { id: 1, nombre: "Dueño de la tienda", usuario: "admin", clave: "demo1234", rol: "dueño" as Rol },
  { id: 2, nombre: "Empleado", usuario: "empleado", clave: "demo1234", rol: "empleado" as Rol },
];

export async function iniciarSesion(usuario: string, clave: string): Promise<Usuario | null> {
  await new Promise((resolver) => setTimeout(resolver, 500)); // simula la espera del servidor
  const cuenta = CUENTAS.find((c) => c.usuario === usuario.trim().toLowerCase() && c.clave === clave);
  if (!cuenta) return null;
  return { id: cuenta.id, nombre: cuenta.nombre, usuario: cuenta.usuario, rol: cuenta.rol };
}
