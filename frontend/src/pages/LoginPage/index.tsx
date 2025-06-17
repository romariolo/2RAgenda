import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './LoginPage.module.css';
import Header from '../../components/Header';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;

            // Salva o token no localStorage do navegador
            localStorage.setItem('authToken', token);

            alert('Login realizado com sucesso!');
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao fazer login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>Acessar seu Painel</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <input type="email" placeholder="Seu E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Sua Senha" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}