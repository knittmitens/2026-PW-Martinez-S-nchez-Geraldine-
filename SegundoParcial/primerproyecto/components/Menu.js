// Menu.js - Navegacion global
import Link from 'next/link';

export default function Menu() {
    return (
        <nav>
                <li><Link href="/">Inicio</Link></li>
                <li><Link href="/MiniProyecto">Mi Primer Proyecto</Link></li>
                <li><Link href="/practica/1">Pagina 2</Link></li>
        </nav>
    );
}