// mini-servidor.js -Demo consumo API Express (puerto 4000)
import { useEffect, useState } from 'react';

export default function MiniServidor() {
    const [saludo, setSaludo] = useState('');
    const [texto, setTexto] = useState('');
    const [eco, setEco] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/mini/saludo')
            .then((res) => res.json())
            .then((data) => setSaludo(data.mensaje))
            .catch(() => setError('El mini servidor no responde. arrancalo con npm start en el puerto 4000'));
    }, []);

    async function enviarEco() {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/mini/eco', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto }),
            });

            const data = await res.json();

            if (!res.ok) {
                setEco(data.eco);
                setTexto('');
            }else {
                setError(`Error: ${data.error}`);
            }
        } catch (err) {
            setError('Error de conexion con el mini servidor');
        }
        }

        return (
            <main>
                <h1>Mini Servidor Express</h1>
                <h2>GET /saludo</h2>
                <p>{saludo}</p>

                <h2>POST /eco</h2>
                <form onSubmit={enviarEco} className="formulario">
                    <input
                    placeholder="Texto"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    />
                    <button type="submit">Enviar</button>
                </form>

                {eco && <p>El servidor respondió: {eco}</p>}
                {error && <p className="error">{error}</p>}
            </main>
        );
}