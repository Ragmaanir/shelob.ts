
export class Mime {
  constructor(readonly value: string, readonly extensions: Array<string>) { }

  static from_extension(extension: string): Mime | null {
    return Object.values(MIMES).find(mime => mime.extensions.includes(extension)) ?? null
  }
}

export const MIMES = {
  HTML: new Mime("text/html", [".html"]),
  JS: new Mime("application/javascript", [".js"]),
  JSON: new Mime("application/json", [".json"]),
  CSS: new Mime("text/css", [".css"]),
  PNG: new Mime("image/png", [".png"]),
  JPG: new Mime("image/jpeg", [".jpg", ".jpeg"]),
  SVG: new Mime("image/svg+xml", [".svg"]),
  ICO: new Mime("image/x-icon", [".ico"]),
  OCTET: new Mime("application/octet-stream", [])
}
