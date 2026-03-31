import { parentPort, workerData } from "worker_threads";
import puppeteer from "puppeteer";

async function scrape({ html, url, keyword }) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    if (html) {
        await page.setContent(html, { waitUntil: "domcontentloaded" });
    } else if (url) {
        await page.goto(url, { waitUntil: "domcontentloaded" });
    } else {
        throw new Error("Provide either url or html");
    }

    await page.waitForSelector("body");

    const result = await page.evaluate((keyword) => {
        keyword = keyword?.toLowerCase();

        const text = el => el.textContent?.trim() || null;

        const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
            .map(text)
            .filter(Boolean);

        const list = [...document.querySelectorAll("li,ul,ol")]
            .map(text)
            .filter(Boolean);

        const links = [...document.querySelectorAll("a[href]")]
            .map(a => ({
                text: a.innerText.trim(),
                href: a.href,
            }))
            .filter(l => l.text);

        const paragraphs = [...document.querySelectorAll("p")]
            .map(text)
            .filter(Boolean);

        const images = [...document.querySelectorAll("img")]
            .filter(img => {
                const alt = (img.alt || "").toLowerCase();
                const src = (img.src || "").toLowerCase();
                return alt.includes(keyword) || src.includes(keyword);
            })
            .map(img => ({
                src: img.src,
                alt: img.alt || null,
            }));

        const inputs = [...document.querySelectorAll("input")].map(el => ({
            type: el.type,
            name: el.name || null,
            id: el.id || null,
            placeholder: el.placeholder || null,
        }));


        const textareas = [...document.querySelectorAll("textarea")].map(el => ({
            tag: "textarea",
            name: el.name || null,
            id: el.id || null,
            value: el.value || null,
            placeholder: el.placeholder || null,
        }));

        const selects = [...document.querySelectorAll("select")].map(el => ({
            tag: "select",
            name: el.name || null,
            id: el.id || null,
            options: [...el.options].map(opt => ({
                text: opt.text,
                value: opt.value,
                selected: opt.selected,
            })),
        }));

        const buttons = [...document.querySelectorAll("button")]
            .map(el => ({
                tag: "button",
                type: el.type,
                text: el.innerText.trim(),
            }));

        return {
            title: document.title,
            headings,
            list,
            links,
            paragraphs,
            images,
            inputs,
            textareas,
            selects,
            buttons,
        };
    }, keyword);

    await browser.close();
    return result;
}

/* ---------- RUN WORKER ---------- */
(async () => {
    try {
        const data = await scrape(workerData);
        parentPort.postMessage({ success: true, data });
    } catch (err) {
        parentPort.postMessage({ success: false, error: err.message });
    }
})();