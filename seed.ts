import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseRawData() {
  const rawDataPath = path.join(__dirname, 'raw_data.txt');
  if (!fs.existsSync(rawDataPath)) return [];
  
  const rawData = fs.readFileSync(rawDataPath, 'utf-8');
  const lines = rawData.split('\n').filter(line => line.trim() !== '');
  const dataLines = lines.slice(2); // Skip headers
  
  const parsedCards = [];
  
  for (const line of dataLines) {
    const columns = line.split('\t');
    if (columns.length >= 8) {
      const firstCol = columns[0].trim();
      const match = firstCol.match(/^([๐-๙]+)\.\s*(.+)$/);
      
      if (match) {
        const thaiNum = match[1];
        const thaiToArabic: Record<string, string> = {
          '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
          '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };
        const arabicNumStr = thaiNum.split('').map(char => thaiToArabic[char] || char).join('');
        const cardNumber = parseInt(arabicNumStr, 10);
        
        parsedCards.push({
          card_number: cardNumber,
          name: match[2].trim(),
          legend: columns[1].trim(),
          general_meaning: columns[2].trim(),
          work: columns[3].trim(),
          finance: columns[4].trim(),
          love: columns[5].trim(),
          health: columns[6].trim(),
          merit: columns[7].trim()
        });
      }
    }
  }
  return parsedCards;
}

function seed() {
  try {
    const data1Path = path.join(__dirname, 'data1.json');
    const data2Path = path.join(__dirname, 'data2.json');
    const data3Path = path.join(__dirname, 'data3.json');
    const data4Path = path.join(__dirname, 'data4.json');
    
    const data1 = JSON.parse(fs.readFileSync(data1Path, 'utf-8'));
    const data2 = JSON.parse(fs.readFileSync(data2Path, 'utf-8'));
    const data3 = JSON.parse(fs.readFileSync(data3Path, 'utf-8'));
    const data4 = JSON.parse(fs.readFileSync(data4Path, 'utf-8'));
    
    const allCards = [...data1, ...data2, ...data3, ...data4];

    const insertCard = db.prepare(`
      INSERT INTO cards (
        card_number, name, group_name, element, legend, general_meaning,
        work, finance, love, health, merit, visual_key, deep_meaning, occult
      ) VALUES (
        @card_number, @name, @group_name, @element, @legend, @general_meaning,
        @work, @finance, @love, @health, @merit, @visual_key, @deep_meaning, @occult
      )
      ON CONFLICT(card_number) DO UPDATE SET
        name = excluded.name,
        group_name = excluded.group_name,
        element = excluded.element,
        legend = excluded.legend,
        general_meaning = excluded.general_meaning,
        work = excluded.work,
        finance = excluded.finance,
        love = excluded.love,
        health = excluded.health,
        merit = excluded.merit,
        visual_key = excluded.visual_key,
        deep_meaning = excluded.deep_meaning,
        occult = excluded.occult
    `);

    const updateFromRawData = db.prepare(`
      UPDATE cards 
      SET 
        name = @name,
        legend = @legend,
        general_meaning = @general_meaning,
        work = @work,
        finance = @finance,
        love = @love,
        health = @health,
        merit = @merit
      WHERE card_number = @card_number
    `);

    const insertMany = db.transaction((cards, rawDataUpdates) => {
      for (const card of cards) {
        insertCard.run(card);
      }
      for (const update of rawDataUpdates) {
        updateFromRawData.run(update);
      }
    });

    const parsedRawData = parseRawData();
    insertMany(allCards, parsedRawData);
    
    console.log(`Successfully seeded ${allCards.length} cards into the database.`);
    if (parsedRawData.length > 0) {
      console.log(`Successfully updated ${parsedRawData.length} cards with data from raw_data.txt.`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seed();
