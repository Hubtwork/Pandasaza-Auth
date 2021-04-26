

export function normalizePort(portNumber?: string): number {
  if (!portNumber) return 3030
  var port: number = parseInt(portNumber, 10)
  // numbering Pipe
  if (port >= 0) return port
  return 3030
}
