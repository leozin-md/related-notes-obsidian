# Related Notes (Gemini)

Obsidian plugin that finds semantically related notes using Gemini embeddings.

## Features

- Indexes Markdown notes in an Obsidian vault.
- Generates embeddings with the Gemini API.
- Shows semantically related notes inside Obsidian.
- Stores the local vector index in the plugin data folder.

## Development

```bash
npm install
npm run build
```

## Privacy

Do not commit `data.json`, `index.json`, or vault-derived exports. They may contain API keys, note metadata, or generated embeddings from a private vault.

## License

MIT
