// _app.js - Wrapper global de la app (Pages Router)
import Menu from '../components/Menu';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Menu />
            <Component {...pageProps} />
        </>
    );
}