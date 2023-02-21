const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require('request');
const app = express();
const port = 3000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// app.get("/", (req, res) => {
//     axios
//       .get("https://www.basketball-reference.com/leagues/NBA_2023_per_game.html")
//       .then((response) => {
//         const html = response.data;
//         const $ = cheerio.load(html);
//         const table = $("#per_game_stats");
  
//         const rows = [];
  
//         // Extract table rows
//         table.find("tbody tr").each(function () {
//           const row = {};
//           $(this)
//             .find("td")
//             .each(function () {
//               const header = $(this).attr("data-stat");
//               row[header] = $(this).text();
//             });
//           rows.push(row);
//         });
  
//         console.log(rows);
  
//         res.send(rows);
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send("Error retrieving data");
//       });
//   });
  app.get('/', (req, res) => {
    request('https://www.basketball-reference.com/leagues/NBA_2023_per_game.html', (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const data = [];
        // Scrape the data you want from the page
        $('tr.full_table').each((i, element) => {
          data.push({
            Player: $(element).find('td[data-stat="player"]').text(),
            Pos: $(element).find('td.center').text(),
            Tm:  $(element).find('td[data-stat="team_id"] a' ).text(),
            Age: parseInt($(element).find('td[data-stat="age"]' ).text()),
            PTS: parseFloat($(element).find('td[data-stat="pts_per_g"]' ).text()),
            G: parseInt($(element).find('td[data-stat="g"]' ).text()),
            GS: parseInt($(element).find('td[data-stat="gs"]' ).text()),
            MP: parseFloat($(element).find('td[data-stat="mp_per_g"]' ).text()),
            FG: parseFloat($(element).find('td[data-stat="fg_per_g"]' ).text()),
            FGA: parseFloat($(element).find('td[data-stat="fga_per_g"]' ).text()),
            'FG%': parseFloat($(element).find('td[data-stat="fg_pct"]' ).text()),
            '3P': parseFloat($(element).find('td[data-stat="fg3_per_g"]' ).text()),
            '3PA': parseFloat($(element).find('td[data-stat="fg3a_per_g"]' ).text()),
            '3P%': parseFloat($(element).find('td[data-stat="fg3_pct"]' ).text()),
            '2P': parseFloat($(element).find('td[data-stat="fg2_per_g"]' ).text()),
            '2PA': parseFloat($(element).find('td[data-stat="fg2a_per_g"]' ).text()),
            '2P%': parseFloat($(element).find('td[data-stat="fg2_pct"]' ).text()),
            FTA: parseFloat($(element).find('td[data-stat="fta_per_g"]' ).text()),
            'FT%': parseFloat($(element).find('td[data-stat="ft_pct"]' ).text()),
            ORB: parseFloat($(element).find('td[data-stat="orb_per_g"]' ).text()),
            DRB: parseFloat($(element).find('td[data-stat="drb_per_g"]' ).text()),
            TRB: parseFloat($(element).find('td[data-stat="trb_per_g"]' ).text()),
            AST: parseFloat($(element).find('td[data-stat="ast_per_g"]' ).text()),
            STL: parseFloat($(element).find('td[data-stat="stl_per_g"]' ).text()),
            BLK: parseFloat($(element).find('td[data-stat="blk_per_g"]' ).text()),
            TOV: parseFloat($(element).find('td[data-stat="tov_per_g"]' ).text()),
          });
        });
  
        // Send the scraped data back to the client as a JSON object
        res.json(data);
        
        // createUser()
  
      }
    });
  });  

app.get('/standings', (req, res) => {
    axios.get('https://www.proballers.com/basketball/league/3/nba/standings')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table.table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          const teamLink = $(this).find('a.list-team-entry');
          row['Rank'] = $(this).find('td').first().text().trim();
          row['Team'] = teamLink.text().trim();
          row['Logo'] = teamLink.find('img').attr('src');
          $(this).find('td').each(function(index) {
            if(index > 0){
              row[headers[index]] = $(this).text().trim();
            }
          });
          rows.push(row);
        });
  
        console.log(rows);
  
        res.send(rows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });


  
  
  
  


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// const { db } = require("./firebase");
// const { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } = require("firebase/firestore");



// const request = require('request');
// const cheerio = require('cheerio');
// const express = require('express');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Express app listening on port ${port}!`);
// });

// app.get('/scrape', (req, res) => {
//   request('https://www.basketball-reference.com/leagues/NBA_2023_per_game.html', (error, response, html) => {
//     if (!error && response.statusCode == 200) {
//       const $ = cheerio.load(html);
//       const data = [];
//       // Scrape the data you want from the page
//       $('tr.full_table').each((i, element) => {
//         data.push({
//           Player: $(element).find('td[data-stat="player"]').text(),
//           Pos: $(element).find('td.center').text(),
//           Tm:  $(element).find('td[data-stat="team_id"] a' ).text(),
//           Age: parseInt($(element).find('td[data-stat="age"]' ).text()),
//           PTS: parseFloat($(element).find('td[data-stat="pts_per_g"]' ).text()),
//           G: parseInt($(element).find('td[data-stat="g"]' ).text()),
//           GS: parseInt($(element).find('td[data-stat="gs"]' ).text()),
//           MP: parseFloat($(element).find('td[data-stat="mp_per_g"]' ).text()),
//           FG: parseFloat($(element).find('td[data-stat="fg_per_g"]' ).text()),
//           FGA: parseFloat($(element).find('td[data-stat="fga_per_g"]' ).text()),
//           'FG%': parseFloat($(element).find('td[data-stat="fg_pct"]' ).text()),
//           '3P': parseFloat($(element).find('td[data-stat="fg3_per_g"]' ).text()),
//           '3PA': parseFloat($(element).find('td[data-stat="fg3a_per_g"]' ).text()),
//           '3P%': parseFloat($(element).find('td[data-stat="fg3_pct"]' ).text()),
//           '2P': parseFloat($(element).find('td[data-stat="fg2_per_g"]' ).text()),
//           '2PA': parseFloat($(element).find('td[data-stat="fg2a_per_g"]' ).text()),
//           '2P%': parseFloat($(element).find('td[data-stat="fg2_pct"]' ).text()),
//           FTA: parseFloat($(element).find('td[data-stat="fta_per_g"]' ).text()),
//           'FT%': parseFloat($(element).find('td[data-stat="ft_pct"]' ).text()),
//           ORB: parseFloat($(element).find('td[data-stat="orb_per_g"]' ).text()),
//           DRB: parseFloat($(element).find('td[data-stat="drb_per_g"]' ).text()),
//           TRB: parseFloat($(element).find('td[data-stat="trb_per_g"]' ).text()),
//           AST: parseFloat($(element).find('td[data-stat="ast_per_g"]' ).text()),
//           STL: parseFloat($(element).find('td[data-stat="stl_per_g"]' ).text()),
//           BLK: parseFloat($(element).find('td[data-stat="blk_per_g"]' ).text()),
//           TOV: parseFloat($(element).find('td[data-stat="tov_per_g"]' ).text()),
//         });
//       });

//       // Send the scraped data back to the client as a JSON object
//       res.json(data);
      
//       const usersCollection = collection(db, 'cases')
//       const createUser = async () => {
//         await Promise.all(data.map(async (el, i) => {
//           await addDoc(usersCollection, {name: el.player, pts: el.PTS});
//         }));
//       }
      
//       // createUser()

//     }
//   });
// });



  
// // app.get('/cases', (req, res) => {
// //   request('https://hitechfix.com/product-category/cases/apple-cases/iphone-cases/iphone-11-cases/page/5/', (error, response, html) => {
// //     if (!error && response.statusCode == 200) {
// //       const $ = cheerio.load(html);
      
// //       const data = [];
// //       // Scrape the data you want from the page
// //       $('.jet-woo-builder-products--columns.products.jet-woo-builder-layout-150301 li').each((i, element) => {
// //         data.push({
// //           item: $(element).find('a').text(),
// //           imgSrc: $(element).find('img').attr('src'),
// //           price: $(element).find('bdi').text()
// //         });
// //       });

// //       // Send the scraped data back to the client as a JSON object
// //       res.json(data);
      
// //       // const usersCollection = collection(db, '/iphone11')
// //       // const createUser = async () => {
// //       //   await Promise.all(data.map(async (el, i) => {
// //       //     await addDoc(usersCollection, {title: el.item, image: el.imgSrc, price: el.price});
// //       //   }));
// //       // }

// //       // createUser()
      
// //     }
// //   });
// // });

// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')


// app.get('/cases', (req, res) => {
//   request('https://hitechfix.com/product-category/cases/apple-cases/iphone-cases/iphone-14-pro-max-cases/page/2/', (error, response, html) => {
//     if (!error && response.statusCode == 200) {
//       const $ = cheerio.load(html);
      
//       const data = [];
//       // Scrape the data you want from the page
//       $('.jet-woo-builder-products--columns.products.jet-woo-builder-layout-150301 li').each((i, element) => {
//         data.push({
//           item: $(element).find('a').text(),
//           imgSrc: $(element).find('img').attr('src'),
//           price: $(element).find('bdi').text()
//         });
//       });

//       // Send the scraped data back to the client as a JSON object
//       res.json(data);

//       // Write the scraped data to db.json
//       const adapter = new FileSync('db.json')
//       const db = low(adapter)
//       db.defaults({ iphone14promax: [] }).write()
//       db.get('iphone14promax').push(...data).write()
//     }
//   });
// });
