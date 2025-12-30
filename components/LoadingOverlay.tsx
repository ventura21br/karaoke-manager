import React from 'react';

const LoadingOverlay: React.FC = () => (
    <div className="fixed inset-0 z-[100] bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-primary animate-pulse">Sincronizando...</p>
    </div>
);

export default LoadingOverlay;
