import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>Agenda Fácil</Link>
            <nav className={styles.nav}>
                <Link to="/cadastro" className={styles.link}>Criar Conta</Link>
                <Link to="/login" className={styles.link}>Login</Link>
            </nav>
        </header>
    );
}