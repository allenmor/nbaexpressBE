const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express app listening on port ${port}!`);
});

app.get('/scrape', (req, res) => {
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

