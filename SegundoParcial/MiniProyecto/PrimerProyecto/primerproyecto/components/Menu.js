import Link from 'next/link'

export default function Menu(){
    return (
        <nav>
            <Link href="/" >Inicio</Link>
            <Link href="/talleres" >Talleres</Link>
            <Link href="/talleres/crear">Crear taller</Link>
            <Link href="/usuarios/nuevo">Registrar usuario</Link>
            <Link href="/perfil" >Mi perfil</Link>
        </nav>
    );
}
