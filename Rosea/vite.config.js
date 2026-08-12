import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({

    plugins: [
        react()
    ],


    build: {

        outDir: "wwwroot/react-build",

        emptyOutDir: true,


        rollupOptions: {

            input: "index.html",

            output: {
                entryFileNames: "assets/index.js"
            }

        }

    }

})