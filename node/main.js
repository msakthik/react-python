import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.join(__dirname, "scraper.worker.js"),
            { workerData: data }
        );

        worker.on("message", resolve);
        worker.on("error", reject);
        worker.on("exit", code => {
            if (code !== 0)
                reject(new Error(`Worker exited ${code}`));
        });
    });
}

const URLResult = await runWorker({
    url: "https://www.w3schools.com/w3css/tryw3css_templates_gourmet_catering.htm",
    keyword: "catering",
});

const res = await fetch("https://example.com");
const html = await res.text();

const HTMLResult = await runWorker({
    html,
    keyword: "example",
});

console.log('html: ', html);
console.log('URLResult: ', URLResult);
console.log('HTMLResult: ', HTMLResult);