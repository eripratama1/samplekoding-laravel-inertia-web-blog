import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <React.Fragment>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <App {...props} />
                    <Toaster />
                </ThemeProvider>
            </React.Fragment>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
