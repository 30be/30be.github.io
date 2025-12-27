import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.js'
async function onLoad() {
    const rootElement = document.getElementById('root') as HTMLDivElement | null

    if (rootElement) {
        const root = createRoot(rootElement)
        root.render(<App />)
    }
}
window.onload = onLoad
