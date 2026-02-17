import { getPortfolioConfig } from '@/lib/config';
import ClientPage from './ClientPage';

export default function Home() {
  const config = getPortfolioConfig();
  return <ClientPage config={config} />;
}
