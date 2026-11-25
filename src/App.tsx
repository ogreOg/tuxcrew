import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';

import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Applicant from './pages/Applicant';
import Pricing from './pages/Pricing';
import Services from './pages/Services';
import Contact from './pages/Contact';
import { Privacy, Terms } from './pages/Legal';
import NotFound from './pages/NotFound';
import { Footer } from './pages/Footer';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apply" component={Applicant} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="flex min-h-screen flex-col justify-between">
          <Router />
          <Footer />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

