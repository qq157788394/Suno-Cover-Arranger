const { chromium } = require("playwright");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  // 收集所有日志（包括 Worker）
  page.on("console", (msg) => {
    if (
      msg.text().includes("[Worker]") ||
      msg.text().includes("分析") ||
      msg.text().includes("Error") ||
      msg.text().includes("Worker error")
    ) {
      console.log("[CONSOLE]", msg.text());
    }
  });
  page.on("pageerror", (err) => console.log("[PAGE ERROR]", err.message));

  // 监听 Worker 中的 console
  await page.evaluate(() => {
    const origWorker = window.Worker;
    window.Worker = class extends origWorker {
      constructor(...args) {
        super(...args);
        this.addEventListener("messageerror", (e) =>
          console.log("[WORKER MSG ERR]", e),
        );
        this.addEventListener("error", (e) =>
          console.log("[WORKER ERROR]", e.message),
        );
      }
    };
  });

  await page.goto("http://localhost:8000/#/chord-analysis");
  await page.waitForTimeout(3000);

  await page.screenshot({ path: "/tmp/chord_test_01_initial.png" });
  console.log("Page loaded");

  const filePath = path.resolve("prd/百年孤寂 - 王菲.mp3");
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  console.log("File uploaded");

  // 等待分析完成或错误
  try {
    await page.waitForFunction(
      () => {
        const text = document.body.innerText;
        return text.includes("分析完成") || text.includes("分析失败");
      },
      { timeout: 120000 },
    );
    console.log("Analysis finished");
  } catch (_e) {
    console.log("Timeout");
  }

  await page.waitForTimeout(1000);
  await page.screenshot({ path: "/tmp/chord_test_02_result.png" });

  // 获取页面上的 Key/BPM/和弦
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log("\n=== Page text (first 1000 chars) ===");
  console.log(bodyText.substring(0, 1000));

  await browser.close();
})();
