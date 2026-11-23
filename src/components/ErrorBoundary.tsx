import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      let readableMessage = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed?.error) {
          readableMessage = `${parsed.error} (${parsed.operationType || 'operation'} on ${parsed.path || 'database'})`;
        }
      } catch {
        // Use raw message if not JSON
      }

      return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#FAF8F5', display: 'flex', alignItems: 'center', py: 8 }}>
          <Container maxWidth="sm">
            <Paper variant="outlined" sx={{ p: 4, borderColor: '#E7E2DA' }}>
              <Typography variant="h4" sx={{ mb: 1.5, color: '#1C1917' }}>
                Something went wrong
              </Typography>
              <Typography variant="body2" sx={{ color: '#57534E', mb: 3, lineHeight: 1.6 }}>
                {readableMessage}
              </Typography>
              <Button variant="contained" color="primary" onClick={this.handleReset}>
                Return to Academy
              </Button>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
