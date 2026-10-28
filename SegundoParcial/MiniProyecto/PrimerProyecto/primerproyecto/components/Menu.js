import Link from 'next/link'

export default function Menu(){
    return (
        <nav>
            <Link href="/" >Inicio</Link>
            <Link href="/talleres" >Talleres</Link>
            <Link href="/perfil" >Mi perfil</Link>
            <Link href="/mini-servidor" >Mini servidor</Link>
        </nav>
    );
}
