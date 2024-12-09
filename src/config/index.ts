export const config = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['application/pdf'],
  maxFiles: 5,
  api: {
    endpoints: {
      process: '/api/process',
      analyze: '/api/analyze',
      compare: '/api/compare',
      chat: '/api/chat'
    }
  }
}

export type Config = typeof config 