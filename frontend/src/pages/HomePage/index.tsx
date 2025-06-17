import Header from '../../components/Header';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>A maneira mais inteligente de agendar seus compromissos.</h1>
        <p className={styles.subtitle}>Conecte sua agenda, compartilhe seu link e deixe a mágica acontecer.</p>
      </main>
    </div>
  );
}