const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require('request');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});


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

  app.get('/celtics', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/101/boston-celtics')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
  app.get('/bucks', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/114/milwaukee-bucks')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
  app.get('/nuggets', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/106/denver-nuggets')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });

  app.get('/nets', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/116/brooklyn-nets')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
  app.get('/knicks', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/117/new-york-knicks')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/76ers', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/119/philadelphia-76ers')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/raptors', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/125/toronto-raptors')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/bulls', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/103/chicago-bulls')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
  app.get('/cavaliers', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/104/cleveland-cavaliers')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });

  app.get('/pistons', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/107/detroit-pistons')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });

  app.get('/pacers', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/110/indiana-pacers')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });

  app.get('/timberwolves', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/115/minnesota-timberwolves')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/thunder', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/1827/oklahoma-city-thunder')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/blazers', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/121/portland-trail-blazers')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/jazz', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/126/utah-jazz')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/warriors', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/108/golden-state-warriors')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/clippers', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/111/la-clippers')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/lakers', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/112/los-angeles-lakers')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/suns', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/120/phoenix-suns')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/kings', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/122/sacramento-kings')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/hawks', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/100/atlanta-hawks')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/hornets', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/825/charlotte-hornets')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/heat', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/113/miami-heat')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/magic', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/118/orlando-magic')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/wizards', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/128/washington-wizards')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
  app.get('/mavericks', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/105/dallas-mavericks')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
  app.get('/rockets', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/109/houston-rockets')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/grizzlies', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/127/memphis-grizzlies')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  app.get('/pelicans', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/102/new-orleans-pelicans')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
  app.get('/spurs', (req, res) => {
    axios.get('https://www.proballers.com/basketball/team/123/san-antonio-spurs')
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const table = $('table');
  
        const headers = [];
        const rows = [];
  
        // Extract table headers
        table.find('thead th').each(function() {
          headers.push($(this).text());
        });
  
        // Extract table rows
        table.find('tbody tr').each(function() {
          const row = {};
          $(this).find('td').each(function(index) {
            row[headers[index]] = $(this).text().trim();
          });
          rows.push(row);
        });
  
        // Remove duplicates
        const uniqueRows = rows.filter((row, index, self) =>
          index === self.findIndex((r) => (
            r.Player === row.Player && r.Pos === row.Pos && r.Height === row.Height
          ))
        );
  
        // Remove objects where Player is equal to "-"
        const filteredRows = uniqueRows.filter(row => row.Player !== "-");
  
        console.log(filteredRows);
  
        res.send(filteredRows);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send('Error retrieving data');
      });
  });
  
app.get('/points', (req, res) => {  
  const url = 'https://www.proballers.com/basketball/league/3/nba';

  axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const players = [];

    $('.home-league__content__card:has(.card__title:contains("Points per game")) .card__content li').each((i, element) => {
      const player = {};
      const cardEntry = $(element).find('.card__entry');

      player.name = cardEntry.find('.card__name .name').text();
      player.team = cardEntry.find('.card__name .team').text();
      player.points = cardEntry.find('.card__stat').text().trim();
      player.img = cardEntry.find('a.card__identity img').attr('src');

      players.push(player);
    });

    res.json(players);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});
app.get('/rebounds', (req, res) => {  
  const url = 'https://www.proballers.com/basketball/league/3/nba';

  axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const players = [];

    $('.home-league__content__card:has(.card__title:contains("Rebounds per game")) .card__content li').each((i, element) => {
      const player = {};
      const cardEntry = $(element).find('.card__entry');

      player.name = cardEntry.find('.card__name .name').text();
      player.team = cardEntry.find('.card__name .team').text();
      player.points = cardEntry.find('.card__stat').text().trim();
      player.img = cardEntry.find('a.card__identity img').attr('src');

      players.push(player);
    });

    res.json(players);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});
app.get('/assists', (req, res) => {  
  const url = 'https://www.proballers.com/basketball/league/3/nba';

  axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const players = [];

    $('.home-league__content__card:has(.card__title:contains("Assists per game")) .card__content li').each((i, element) => {
      const player = {};
      const cardEntry = $(element).find('.card__entry');

      player.name = cardEntry.find('.card__name .name').text();
      player.team = cardEntry.find('.card__name .team').text();
      player.points = cardEntry.find('.card__stat').text().trim();
      player.img = cardEntry.find('a.card__identity img').attr('src');

      players.push(player);
    });

    res.json(players);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});
app.get('/threes', (req, res) => {  
  const url = 'https://www.proballers.com/basketball/league/3/nba';

  axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const players = [];

    $('.home-league__content__card:has(.card__title:contains("3-pointers made per game")) .card__content li').each((i, element) => {
      const player = {};
      const cardEntry = $(element).find('.card__entry');

      player.name = cardEntry.find('.card__name .name').text();
      player.team = cardEntry.find('.card__name .team').text();
      player.points = cardEntry.find('.card__stat').text().trim();
      player.img = cardEntry.find('a.card__identity img').attr('src');

      players.push(player);
    });

    res.json(players);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});
app.get('/steals', (req, res) => {  
  const url = 'https://www.proballers.com/basketball/league/3/nba';

  axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const players = [];

    $('.home-league__content__card:has(.card__title:contains("Steals per game")) .card__content li').each((i, element) => {
      const player = {};
      const cardEntry = $(element).find('.card__entry');

      player.name = cardEntry.find('.card__name .name').text();
      player.team = cardEntry.find('.card__name .team').text();
      player.points = cardEntry.find('.card__stat').text().trim();
      player.img = cardEntry.find('a.card__identity img').attr('src');

      players.push(player);
    });

    res.json(players);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});
app.get('/blocks', (req, res) => {  
  const url = 'https://www.proballers.com/basketball/league/3/nba';

  axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const players = [];

    $('.home-league__content__card:has(.card__title:contains("Blocks per game")) .card__content li').each((i, element) => {
      const player = {};
      const cardEntry = $(element).find('.card__entry');

      player.name = cardEntry.find('.card__name .name').text();
      player.team = cardEntry.find('.card__name .team').text();
      player.points = cardEntry.find('.card__stat').text().trim();
      player.img = cardEntry.find('a.card__identity img').attr('src');

      players.push(player);
    });

    res.json(players);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});
app.get('/efficiency', (req, res) => {  
  const url = 'https://www.proballers.com/basketball/league/3/nba';

  axios.get(url).then(response => {
    const $ = cheerio.load(response.data);
    const players = [];

    $('.home-league__content__card:has(.card__title:contains("Efficiency per game")) .card__content li').each((i, element) => {
      const player = {};
      const cardEntry = $(element).find('.card__entry');

      player.name = cardEntry.find('.card__name .name').text();
      player.team = cardEntry.find('.card__name .team').text();
      player.points = cardEntry.find('.card__stat').text().trim();
      player.img = cardEntry.find('a.card__identity img').attr('src');

      players.push(player);
    });

    res.json(players);
  }).catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
