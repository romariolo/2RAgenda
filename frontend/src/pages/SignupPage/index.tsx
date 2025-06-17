import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './SignupPage.module.css';
import Header from '../../components/Header';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/users', { name, email, password, specialty });
            const newUser = response.data;
            alert('Cadastro realizado com sucesso!');
            navigate(`/agendar/${newUser.slug}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao realizar o cadastro.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
          <Header />
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>Crie sua Conta Profissional</h2>
                    {error && <p className={styles.error}>{error}</p>}
                    <input type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} required />
                    <input type="email" placeholder="E-mail de Trabalho" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Crie uma Senha" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
                    <input type="text" placeholder="Sua Especialidade (ex: Psicólogo)" value={specialty} onChange={e => setSpecialty(e.target.value)} required />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Criando...' : 'Criar Conta'}
                    </button>
                </form>
            </div>
        </div>
    );
}