import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';

import api from '../../services/api';
import styles from './BookingPage.module.css';
import Header from '../../components/Header';

interface Professional {
    name: string;
    specialty: string;
}

export default function BookingPage() {
    const { slug } = useParams<{ slug: string }>();
    const [professional, setProfessional] = useState<Professional | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    
    // Simulação até o backend entregar os horários
    const availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    useEffect(() => {
        if (!slug) return;
        
        api.get(`/users/${slug}`)
            .then(response => {
                setProfessional(response.data);
            })
            .catch(() => {
                setError('Profissional não encontrado.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return <div><Header /><div className={styles.message}>Carregando...</div></div>;
    }

    if (error) {
        return <div><Header /><div className={styles.message_error}>{error}</div></div>;
    }

    return (
        <div>
            <Header />
            <main className={styles.container}>
                <div className={styles.headerInfo}>
                    <h1>Agendar com {professional?.name}</h1>
                    <p>{professional?.specialty}</p>
                </div>
                <div className={styles.bookingLayout}>
                    <div className={styles.calendarContainer}>
                       <h2>1. Selecione a data</h2>
                       <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            fromDate={new Date()}
                            locale={ptBR}
                            styles={{
                                head_cell: { width: '40px' },
                                caption_label: { fontSize: '1.1rem', fontWeight: 'bold' },
                            }}
                        />
                    </div>
                    <div className={styles.slotsContainer}>
                        <h2>2. Escolha o horário</h2>
                        {selectedDate ? (
                            <div className={styles.slotsGrid}>
                                {availableSlots.map(time => (
                                    <button key={time} className={styles.timeSlot}>
                                        {time}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p>Por favor, selecione uma data no calendário.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}