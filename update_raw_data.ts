import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseRawData() {
  const rawDataPath = path.join(__dirname, 'raw_data.txt');
  const rawData = fs.readFileSync(rawDataPath, 'utf-8');
  
  const lines = rawData.split('\n').filter(line => line.trim() !== '');
  // Skip header lines
  const dataLines = lines.slice(2);
  
  const parsedCards = [];
  
  for (const line of dataLines) {
    const columns = line.split('\t');
    if (columns.length >= 8) {
      // Extract card number and name
      // e.g., "๓๑. ไพ่เสด็จมนุสสภูมิ"
      const firstCol = columns[0].trim();
      const match = firstCol.match(/^([๐-๙]+)\.\s*(.+)$/);
      
      if (match) {
        // Convert Thai numerals to Arabic
        const thaiNum = match[1];
        const thaiToArabic = {
          '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
          '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };
        const arabicNumStr = thaiNum.split('').map(char => thaiToArabic[char] || char).join('');
        const cardNumber = parseInt(arabicNumStr, 10);
        const cardName = match[2].trim();
        
        parsedCards.push({
          card_number: cardNumber,
          name: cardName,
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

function updateDatabase() {
  try {
    const parsedCards = parseRawData();
    console.log(`Parsed ${parsedCards.length} cards from raw_data.txt`);
    
    const updateCard = db.prepare(`
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

    const updateMany = db.transaction((cards) => {
      for (const card of cards) {
        const result = updateCard.run(card);
        if (result.changes > 0) {
          console.log(`Updated card ${card.card_number}: ${card.name}`);
        } else {
          console.log(`Card ${card.card_number} not found in DB, skipping update.`);
        }
      }
    });

    updateMany(parsedCards);
    console.log('Successfully updated database with raw_data.txt content.');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

updateDatabase();
