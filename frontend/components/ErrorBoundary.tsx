import React, { Component, ReactNode } from 'react';

type ErrorBoundaryProps = {
    fallback: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
};

function logErrorToMyService(error: Error, componentStack: string) {
    // Replace this with your actual error logging logic
    console.error(error);
    console.error(componentStack);
}

class ErrorBoundary extends Component<
    React.PropsWithChildren<ErrorBoundaryProps>,
    ErrorBoundaryState
> {
    constructor(props: React.PropsWithChildren<ErrorBoundaryProps>) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        logErrorToMyService(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
