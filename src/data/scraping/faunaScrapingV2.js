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
  const maxConcurrentPages = 50;
  let activePages = 0;
  const queue = [];

  const browser = await chromium.launch({headless: true});

  for (let i = 1; i <= 7; i++) {
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
    await fs.writeFile("./info/camaron.json", JSON.stringify(fauna, null, 2), "utf-8");
    console.log("Datos guardados en camaron.json");
  } catch (error) {
    console.error("Error al guardar el archivo JSON:", error.message);
  }
})();

async function evaluateFaunaPage(browser, index, fauna){
  console.log("Evaluando pagina:", index)
  const page = await browser.newPage();

  await reTryGoto(page, `https://www.especiesamenazadas.org/taxon/arthropoda?page=${index}`)
  
  await page.waitForSelector("div.card-img.pr-3 a");
  const linksAnimals = await page.$$eval("div.card-img.pr-3 a", elements =>
    elements.map(el => el.getAttribute("href"))
  );

  for (const link of linksAnimals) {
    await evaluateAnimalPage(page, "https://www.especiesamenazadas.org/"+link, fauna)
  }

  await page.close();
}

async function evaluateAnimalPage(page, link, animals) {
  const animal = {
    image : "",
    imageDistribution : "",
    scientificName : "",
    phylum : "",
    class : "",
    order : "",
    family : "",
    genus : "",
    state : "",
    commonNames : [],
    description : "",
    distribution : "",
    situation : "",
    danger : "",
    conservation : "",
  }

  try {
    await await reTryGoto(page, link)

    //await scrollPage(page)

    animal.image = await getLink(page, "div.text-center a")
    animal.imageDistribution = await getLink(page, "div.col-md-4 > div > div:nth-child(2) > a")

    animal.scientificName = await getTextContent(page, `div.col-md-8 > p:nth-child(1) > i`);

    let childStart = 5
    try{
      animal.phylum = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart}) > a`);
    }catch (error) {
      childStart = 7
      try{
        animal.phylum = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart}) > a`);
      }catch (error) {
        childStart = 9
        animal.phylum = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart}) > a`);
      }
    }

    animal.class = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart+1}) > a`);
    animal.order = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart+2}) > a`);
    animal.family = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart+3}) > a`);
    animal.genus = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart+4}) > a`);

    animal.state = await getTextContent(page, `div.col-md-8 > p:nth-child(${childStart+5}) > a`);

    animal.description = await getTextContent(page, ` div.col-md-8 > p:nth-child(${childStart+12})`);

    animal.distribution = await getTextContent(page, ` div.col-md-8 > p:nth-child(${childStart+16})`);

    animal.situation = await getTextContent(page, ` div.col-md-8 > p:nth-child(${childStart+20})`);

    animal.danger = await getTextContent(page, ` div.col-md-8 > p:nth-child(${childStart+24})`);

    animal.conservation = await getTextContent(page, ` div.col-md-8 > p:nth-child(${childStart+28})`);
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
  await page.waitForSelector(selector, {timeout: 3000});
  return await page.$eval(selector, el => el.textContent?.trim());
}

async function getLink(page, selector) {
  await page.waitForSelector(selector);
  const link = await page.$eval(selector, el => el.getAttribute("href"));
  return link;
}