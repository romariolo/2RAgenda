// Caminho: src/pages/DashboardPage/index.tsx

import { useState, FormEvent, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import styles from './DashboardPage.module.css';

interface Service {
    id: string;
    name: string;
    duration: number;
    price: number;
}

export default function DashboardPage() {
    const [serviceName, setServiceName] = useState('');
    const [serviceDuration, setServiceDuration] = useState(60);
    const [servicePrice, setServicePrice] = useState(100);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Função para carregar os serviços do backend
    const fetchServices = async () => {
        setLoading(true);
        try {
            // A chamada GET para /services agora é protegida e usa o token
            // para identificar o usuário no backend.
            const response = await api.get('/services');
            setServices(response.data);
        } catch (error) {
            console.error("Erro ao buscar serviços:", error);
            // Se o erro for 401 ou 403, significa que o token é inválido ou expirou.
            // Futuramente, redirecionaremos para a página de login.
            alert("Sessão expirada. Por favor, faça login novamente.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect: Roda a função fetchServices uma vez quando a página carrega
    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddService = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // A API já envia o token automaticamente, o backend saberá o userId
            const response = await api.post('/services', {
                name: serviceName,
                duration: Number(serviceDuration),
                price: Number(servicePrice),
            });
            // Adiciona o novo serviço à lista na tela, sem precisar recarregar
            setServices(currentServices => [...currentServices, response.data]);
            
            // Limpa os campos do formulário
            setServiceName('');
            setServiceDuration(60);
            setServicePrice(100);
        } catch (error) {
            alert('Erro ao adicionar serviço.');
            console.error(error);
        }
    };

    return (
        <div>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>Meu Painel de Controle</h1>
                
                <div className={styles.grid}>
                    {/* Card para Adicionar Serviço */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Adicionar Novo Serviço</h2>
                        <form onSubmit={handleAddService} className={styles.form}>
                            <input type="text" placeholder="Nome do Serviço" value={serviceName} onChange={e => setServiceName(e.target.value)} required />
                            <input type="number" placeholder="Duração (minutos)" value={serviceDuration} onChange={e => setServiceDuration(Number(e.target.value))} required />
                            <input type="number" step="0.01" placeholder="Preço (R$)" value={servicePrice} onChange={e => setServicePrice(Number(e.target.value))} required />
                            <button type="submit">Adicionar Serviço</button>
                        </form>
                    </div>

                    {/* Card para Listar Serviços */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Meus Serviços Cadastrados</h2>
                        {loading ? (
                            <p>Carregando serviços...</p>
                        ) : (
                            <ul className={styles.serviceList}>
                                {services.length > 0 ? services.map(service => (
                                    <li key={service.id}>
                                        <span>{service.name} ({service.duration} min)</span>
                                        <span>R$ {service.price.toFixed(2)}</span>
                                    </li>
                                )) : (
                                    <p>Nenhum serviço cadastrado ainda.</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}