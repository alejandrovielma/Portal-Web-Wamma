import {chromium} from "playwright"
import fs from "fs/promises"

class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }

  async lock() {
    if (this.locked) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    this.locked = true;
  }

  unlock() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }
}

const mutex = new Mutex();

(async () => {
  const fauna = []
  const maxConcurrentPages = 3;
  let activePages = 0;
  const queue = [];

  const browser = await chromium.launch({headless: true});

  for (let i = 1; i <= 557; i++) {
    queue.push(() => evaluateFaunaPage(browser, i, fauna));
  }

  await Promise.all(
    queue.map(async (task) => {
      while (activePages >= maxConcurrentPages) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      activePages++;
      try {
        await task();
      } finally {
        activePages--;
      }
    })
  );

  console.log("Operacion Terminada")
  await browser.close();

  try {
    await fs.writeFile("./info/fauna.json", JSON.stringify(fauna, null, 2), "utf-8");
    console.log("Datos guardados en fauna.json");
  } catch (error) {
    console.error("Error al guardar el archivo JSON:", error.message);
  }
})();

async function evaluateFaunaPage(browser, index, fauna){
  console.log("Evaluando pagina:", index)
  const page = await browser.newPage();

  await reTryGoto(page, `http://svdb.minec.gob.ve/category/fauna/page/${index}`)
  
  await evaluateAnimalPage(page, fauna)
  await page.close();
}

async function reTryGoto(page, link) {
  while (true){
    try {
      await page.goto(link);
      break
    }
    catch (error) {
      console.log("Reintentando ", link);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

async function evaluateAnimalPage(page, animals) {
  await page.waitForSelector(".elementor-post__title a");
  const linksAnimals = await page.$$eval(".elementor-post__title a", elements =>
    elements.map(el => el.getAttribute("href"))
  );

  for (const link of linksAnimals) {
    const animal = {
      image : "",
      commonNames : [],
      scientificName : "",
      domain: "",
      kingdom : "",
      phylum : "",
      class : "",
      order : "",
      family : "",
      genus : "",
      state : "",
      description : "",
      distribution : "",
      situation : "",
      danger : "",
      conservation : "",
    }

    try {
      await await reTryGoto(page, link)

      await scrollPage(page)

      animal.image = await getLink(page, ".wp-caption a")
      
      try{
        const commonNamesText = await getTextContent(page, '.elementor-heading-title elementor-size-default')
        animal.commonNames = commonNamesText.replace(/>/g, "").trim();
      }catch (error) {
        console.log("Error al obtener nombre unico", error.message);
      }
      try{
        const commonNamesText = await getTextContent(page, '[data-id="5b6205f"] .elementor-widget-container');
        animal.commonNames = commonNamesText.split(",").map(name => name.trim());
      }catch (error) {
        console.log("Error al obtener nombres comunes: ", error.message);
      }

      animal.scientificName = await getTextContent(page, '[data-id="8dc1c4a"] .elementor-widget-container');

      animal.domain = await getTextContent(page, '[data-id="cd54815"] .elementor-widget-container');
      animal.kingdom = await getTextContent(page, '[data-id="7de0920"] .elementor-widget-container');
      animal.phylum = await getTextContent(page, '[data-id="6f68018"] .elementor-widget-container');
      animal.class = await getTextContent(page, '[data-id="c8f0190"] .elementor-widget-container');
      animal.order = await getTextContent(page, '[data-id="763a1cb"] .elementor-widget-container');
      animal.family = await getTextContent(page, '[data-id="895705a"] .elementor-widget-container');
      animal.genus = await getTextContent(page, '[data-id="c4ff0e9"] .elementor-widget-container');

      animal.state = await getTextContent(page, '[data-id="3ceeaa9"] .elementor-widget-container');

      animal.description = await getTextContent(page, '[data-id="5712260"] .elementor-widget-container');

      animal.distribution = await getTextContent(page, '[data-id="a15821c"] .elementor-widget-container');

      animal.situation = await getTextContent(page, '[data-id="622a750"] .elementor-widget-container');

      animal.danger = await getTextContent(page, '[data-id="4a84002"] .elementor-widget-container');

      animal.conservation = await getTextContent(page, '[data-id="7919283"] .elementor-widget-container');
    }
    catch (error) {
      console.log("Error al evaluar animal: ", error.message);
    }finally {
      console.log(animals.length + ". Animal Evaluado:", link)
      console.log(animal)

      await mutex.lock();
      try {
        animals.push(animal);
      } finally {
        mutex.unlock();
      }
    }
  }
}

async function scrollPage(page){
  await page.evaluate(async () => {
    const scrollStep = 100; // Cantidad de píxeles por paso
    const delay = 100; // Tiempo de espera entre cada paso en milisegundos
  
    for (let position = 0; position < document.body.scrollHeight; position += scrollStep) {
      window.scrollTo(0, position);
      await new Promise(resolve => setTimeout(resolve, delay)); // Esperar antes de continuar
    }
  });
}

async function getTextContent(page, selector) {
  await page.waitForSelector(selector, {timeout: 5000});
  return await page.$eval(selector, el => el.textContent?.trim());
}

async function getLink(page, selector) {
  await page.waitForSelector(selector);
  const link = await page.$eval(selector, el => el.getAttribute("href"));
  return link;
}