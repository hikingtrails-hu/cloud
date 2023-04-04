import { load as loadDom } from 'cheerio'

export const getLinkUrlsFromHtml = (html: string): string[] => {
    const dom = loadDom(html)
    const links = dom('a[href]') as any
    const result = []
    for (let i = 0; i < links.length; ++i) {
        result.push(links[i].attribs.href)
    }
    return result
}

export class LinkNotFoundError extends Error {}

export const findByPattern = (links: string[], pattern: RegExp): string => {
    const result = links.find((link) => link.match(pattern))
    if (!result) {
        throw new LinkNotFoundError()
    }
    return result
}
