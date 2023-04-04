import { describe, it, expect } from '@jest/globals'
import { createServer } from 'http'
import { findFreePorts } from 'find-free-ports'
import { http } from '@/http/http'

describe('get()', () => {
    it('returns response body', async () => {
        const port = (await findFreePorts(1))[0] as number
        const server = createServer((req, res) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end('Test')
        }).listen(port)
        const response = await http.get(`http://localhost:${port}`)
        expect(response).toEqual('Test')
        await server.close()
    })
})
