import React, { Component, ErrorInfo } from "react"

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal.</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
