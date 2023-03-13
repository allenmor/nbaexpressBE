const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  request(
    "https://www.basketball-reference.com/leagues/NBA_2023_per_game.html",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const data = [];
        // Scrape the data you want from the page
        $("tr.full_table").each((i, element) => {
          data.push({
            Player: $(element).find('td[data-stat="player"]').text(),
            Pos: $(element).find("td.center").text(),
            Tm: $(element).find('td[data-stat="team_id"] a').text(),
            Age: parseInt($(element).find('td[data-stat="age"]').text()),
            PTS: parseFloat(
              $(element).find('td[data-stat="pts_per_g"]').text()
            ),
            G: parseInt($(element).find('td[data-stat="g"]').text()),
            GS: parseInt($(element).find('td[data-stat="gs"]').text()),
            MP: parseFloat($(element).find('td[data-stat="mp_per_g"]').text()),
            FG: parseFloat($(element).find('td[data-stat="fg_per_g"]').text()),
            FGA: parseFloat(
              $(element).find('td[data-stat="fga_per_g"]').text()
            ),
            "FG%": parseFloat($(element).find('td[data-stat="fg_pct"]').text()),
            "3P": parseFloat(
              $(element).find('td[data-stat="fg3_per_g"]').text()
            ),
            "3PA": parseFloat(
              $(element).find('td[data-stat="fg3a_per_g"]').text()
            ),
            "3P%": parseFloat(
              $(element).find('td[data-stat="fg3_pct"]').text()
            ),
            "2P": parseFloat(
              $(element).find('td[data-stat="fg2_per_g"]').text()
            ),
            "2PA": parseFloat(
              $(element).find('td[data-stat="fg2a_per_g"]').text()
            ),
            "2P%": parseFloat(
              $(element).find('td[data-stat="fg2_pct"]').text()
            ),
            FTA: parseFloat(
              $(element).find('td[data-stat="fta_per_g"]').text()
            ),
            "FT%": parseFloat($(element).find('td[data-stat="ft_pct"]').text()),
            ORB: parseFloat(
              $(element).find('td[data-stat="orb_per_g"]').text()
            ),
            DRB: parseFloat(
              $(element).find('td[data-stat="drb_per_g"]').text()
            ),
            TRB: parseFloat(
              $(element).find('td[data-stat="trb_per_g"]').text()
            ),
            AST: parseFloat(
              $(element).find('td[data-stat="ast_per_g"]').text()
            ),
            STL: parseFloat(
              $(element).find('td[data-stat="stl_per_g"]').text()
            ),
            BLK: parseFloat(
              $(element).find('td[data-stat="blk_per_g"]').text()
            ),
            TOV: parseFloat(
              $(element).find('td[data-stat="tov_per_g"]').text()
            ),
          });
        });

        // Send the scraped data back to the client as a JSON object
        res.json(data);
      }
    }
  );
});

app.get("/standings", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/league/3/nba/standings")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table.table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        const teamLink = $(this).find("a.list-team-entry");
        row["Rank"] = $(this).find("td").first().text().trim();
        row["Team"] = teamLink.text().trim();
        row["Logo"] = teamLink.find("img").attr("src");
        $(this)
          .find("td")
          .each(function (index) {
            if (index > 0) {
              row[headers[index]] = $(this).text().trim();
            }
          });
        rows.push(row);
      });

      console.log(rows);

      res.send(rows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/celtics", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/101/boston-celtics")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/bucks", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/114/milwaukee-bucks")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/nuggets", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/106/denver-nuggets")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/nets", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/116/brooklyn-nets")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/knicks", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/117/new-york-knicks")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/76ers", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/119/philadelphia-76ers")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/raptors", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/125/toronto-raptors")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/bulls", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/103/chicago-bulls")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/cavaliers", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/104/cleveland-cavaliers")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/pistons", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/107/detroit-pistons")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/pacers", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/110/indiana-pacers")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/timberwolves", (req, res) => {
  axios
    .get(
      "https://www.proballers.com/basketball/team/115/minnesota-timberwolves"
    )
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/thunder", (req, res) => {
  axios
    .get(
      "https://www.proballers.com/basketball/team/1827/oklahoma-city-thunder"
    )
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/blazers", (req, res) => {
  axios
    .get(
      "https://www.proballers.com/basketball/team/121/portland-trail-blazers"
    )
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/jazz", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/126/utah-jazz")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/warriors", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/108/golden-state-warriors")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/clippers", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/111/la-clippers")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/lakers", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/112/los-angeles-lakers")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/suns", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/120/phoenix-suns")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/kings", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/122/sacramento-kings")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/hawks", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/100/atlanta-hawks")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/hornets", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/825/charlotte-hornets")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/heat", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/113/miami-heat")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/magic", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/118/orlando-magic")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/wizards", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/128/washington-wizards")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/mavericks", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/105/dallas-mavericks")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/rockets", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/109/houston-rockets")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/grizzlies", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/127/memphis-grizzlies")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});
app.get("/pelicans", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/102/new-orleans-pelicans")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/spurs", (req, res) => {
  axios
    .get("https://www.proballers.com/basketball/team/123/san-antonio-spurs")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $("table");

      const headers = [];
      const rows = [];

      // Extract table headers
      table.find("thead th").each(function () {
        headers.push($(this).text());
      });

      // Extract table rows
      table.find("tbody tr").each(function () {
        const row = {};
        $(this)
          .find("td")
          .each(function (index) {
            row[headers[index]] = $(this).text().trim();
          });
        rows.push(row);
      });

      // Remove duplicates
      const uniqueRows = rows.filter(
        (row, index, self) =>
          index ===
          self.findIndex(
            (r) =>
              r.Player === row.Player &&
              r.Pos === row.Pos &&
              r.Height === row.Height
          )
      );

      // Remove objects where Player is equal to "-"
      const filteredRows = uniqueRows.filter((row) => row.Player !== "-");

      console.log(filteredRows);

      res.send(filteredRows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data");
    });
});

app.get("/leaderstats", (req, res) => {
  const url = "https://www.proballers.com/basketball/league/3/nba";

  const categories = [
    {
      name: "points",
      selector:
        '.home-league__content__card:has(.card__title:contains("Points per game")) .card__content li',
    },
    {
      name: "rebounds",
      selector:
        '.home-league__content__card:has(.card__title:contains("Rebounds per game")) .card__content li',
    },
    {
      name: "assists",
      selector:
        '.home-league__content__card:has(.card__title:contains("Assists per game")) .card__content li',
    },
    {
      name: "threes",
      selector:
        '.home-league__content__card:has(.card__title:contains("3-pointers made per game")) .card__content li',
    },
    {
      name: "steals",
      selector:
        '.home-league__content__card:has(.card__title:contains("Steals per game")) .card__content li',
    },
    {
      name: "blocks",
      selector:
        '.home-league__content__card:has(.card__title:contains("Blocks per game")) .card__content li',
    },
    {
      name: "efficiency",
      selector:
        '.home-league__content__card:has(.card__title:contains("Efficiency per game")) .card__content li',
    },
  ];

  const promises = categories.map((category) => {
    return axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const players = [];

        $(category.selector).each((i, element) => {
          const player = {};
          const cardEntry = $(element).find(".card__entry");

          player.name = cardEntry.find(".card__name .name").text();
          player.team = cardEntry.find(".card__name .team").text();
          player.points = cardEntry.find(".card__stat").text().trim();
          player.img = cardEntry.find("a.card__identity img").attr("src");

          players.push(player);
        });

        return { [category.name]: players };
      })
      .catch((error) => {
        console.log(error);
        return { [category.name]: [] };
      });
  });

  Promise.all(promises).then((results) => {
    const stats = {};

    results.forEach((result) => {
      const [key, value] = Object.entries(result)[0];
      stats[key] = value;
    });

    res.json(stats);
  });
});
app.get("/upcoming", (req, res) => {
  axios
    .get("https://sportsdata.usatoday.com/basketball/nba/scores")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const upcomingGames = [];

      $(".class-CJ3UWs3").each((i, element) => {
        $(".class-37RyWMg").each((j, gameElement) => {
          const awayTeamName = $(gameElement)
            .find(".class-jer7RpM")
            .first()
            .text();
          const awayRecord = $(gameElement)
            .find(".class-JBRBGd- .class-QA1t2Tt")
            .first()
            .text();
          // const awayImgSrc = $(gameElement).find(".class-xuy-sj0 .class-A-tZ6JF img").first().attr("src");
          const homeTeamName = $(gameElement)
            .find(".class-jer7RpM")
            .last()
            .text();
          const homeRecord = $(gameElement)
            .find(".class-JBRBGd- .class-QA1t2Tt")
            .last()
            .text();
          // const homeImgSrc = $(gameElement).find(".class-xuy-sj0 .class-A-tZ6JF img").last().attr("src");
          const arena = $(gameElement).find(".class-0OfJ5G6").last().text();
          const city = $(gameElement).find(".class-XD3FDFr").last().text();
          const spreadAway = $(gameElement)
            .find(".class-BO6V0Dn .class-Pq2FfHX")
            .eq(0)
            .text();
          const spreadHome = $(gameElement)
            .find(".class-BO6V0Dn .class-Pq2FfHX")
            .eq(3)
            .text();
          const moneyLineAway = $(gameElement)
            .find(".class-BO6V0Dn .class-Pq2FfHX")
            .eq(1)
            .text();
          const moneyLineHome = $(gameElement)
            .find(".class-BO6V0Dn .class-Pq2FfHX")
            .eq(4)
            .text();
          const totalOver = $(gameElement)
            .find(".class-BO6V0Dn .class-Pq2FfHX")
            .eq(2)
            .text();
          const totalUnder = $(gameElement)
            .find(".class-BO6V0Dn .class-Pq2FfHX")
            .eq(5)
            .text();
          const timeElement = $(gameElement)
            .find(".class-8ygQElb:not(.class-E41EmCr)")
            .first()
            .text();
          const game = {
            awayTeamName,
            awayRecord,
            timeElement,
            spreadAway,
            moneyLineAway,
            homeTeamName,
            homeRecord,
            spreadHome,
            moneyLineHome,
            arena,
            city,
            totalOver,
            totalUnder,
          };
          upcomingGames.push(game);
        });
      });

      res.json(upcomingGames);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error.message);
    });
});

app.get("/predict", (req, res) => {
  axios
    .get("https://projects.fivethirtyeight.com/2023-nba-predictions/games/")
    .then((response) => {
      const $ = cheerio.load(response.data);
      const games = [];

      // Scrape each game div and extract the relevant information
      $(".game").each((index, element) => {
        const game = {};

        // Extract the team names
        const team1 = $(element).find(".team").eq(0).text().trim();
        const team2 = $(element).find(".team").eq(1).text().trim();
        game.teams = [team1, team2];

        // Extract the spread and win probability
        const spread = $(element).find(".spread").text().trim();
        const winProb = $(element).find(".chance").text().trim();
        game.spread = spread;
        game.winProb = winProb;

        // Extract the metrics
        const metrics = $(element).find(".metric-table td");
        game.quality = $(metrics[0]).find(".val").text().trim();
        game.importance = $(metrics[1]).find(".val").text().trim();
        game.overall = $(metrics[2]).find(".val").text().trim();

        games.push(game);
      });

      res.json(games);
    })
    .catch((error) => {
      console.log(error);
      res.send("Error scraping website");
    });
});

app.get("/statleader", (req, res) => {
  const url = "https://www.proballers.com/basketball/league/3/nba";

  const categories = [
    {
      name: "points",
      selector:
        '.home-league__content__card:has(.card__title:contains("Points in a game")) .card__content li',
    },
    {
      name: "rebounds",
      selector:
        '.home-league__content__card:has(.card__title:contains("Rebounds in a game")) .card__content li',
    },
    {
      name: "assists",
      selector:
        '.home-league__content__card:has(.card__title:contains("Assists in a game")) .card__content li',
    },
    {
      name: "threes",
      selector:
        '.home-league__content__card:has(.card__title:contains("3-pointers made in a game")) .card__content li',
    },
    {
      name: "steals",
      selector:
        '.home-league__content__card:has(.card__title:contains("Steals in a game")) .card__content li',
    },
    {
      name: "blocks",
      selector:
        '.home-league__content__card:has(.card__title:contains("Blocks in a game")) .card__content li',
    },
    {
      name: "efficiency",
      selector:
        '.home-league__content__card:has(.card__title:contains("Efficiency in a game")) .card__content li',
    },
  ];

  const promises = categories.map((category) => {
    return axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const players = [];

        $(category.selector).each((i, element) => {
          const player = {};
          const cardEntry = $(element).find(".card__entry");

          player.name = cardEntry.find(".card__name .name").text();
          player.team = cardEntry.find(".card__name .team").text();
          player.points = cardEntry.find(".card__stat").text().trim();
          player.img = cardEntry.find("a.card__identity img").attr("src");

          players.push(player);
        });

        return { [category.name]: players };
      })
      .catch((error) => {
        console.log(error);
        return { [category.name]: [] };
      });
  });

  Promise.all(promises).then((results) => {
    const stats = {};

    results.forEach((result) => {
      const [key, value] = Object.entries(result)[0];
      stats[key] = value;
    });

    res.json(stats);
  });
});

app.get("/playerz", (req, res) => {
  const url =
    "https://www.basketball-reference.com/leagues/NBA_2023_per_game.html"; // Replace with the URL that contains the table of NBA players

  axios
    .get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const tableRows = $("tr.full_table");
      const players = [];

      tableRows.each((i, row) => {
        const player = {
          name: $(row).find('td[data-stat="player"]').text(),
          team: $(row).find('td[data-stat="team_id"]').text(),
          position: $(row).find('td[data-stat="pos"]').text(),
          age: $(row).find('td[data-stat="age"]').text(),
          gamesPlayed: $(row).find('td[data-stat="g"]').text(),
          gamesStarted: $(row).find('td[data-stat="gs"]').text(),
          minutesPerGame: $(row).find('td[data-stat="mp_per_g"]').text(),
          fieldGoalsMade: $(row).find('td[data-stat="fg_per_g"]').text(),
          fieldGoalsAttempted: $(row).find('td[data-stat="fga_per_g"]').text(),
          fieldGoalPercentage: $(row).find('td[data-stat="fg_pct"]').text(),
          threePointersMade: $(row).find('td[data-stat="fg3_per_g"]').text(),
          threePointersAttempted: $(row)
            .find('td[data-stat="fg3a_per_g"]')
            .text(),
          threePointPercentage: $(row).find('td[data-stat="fg3_pct"]').text(),
          twoPointersMade: $(row).find('td[data-stat="fg2_per_g"]').text(),
          twoPointersAttempted: $(row)
            .find('td[data-stat="fg2a_per_g"]')
            .text(),
          twoPointPercentage: $(row).find('td[data-stat="fg2_pct"]').text(),
          effectiveFieldGoalPercentage: $(row)
            .find('td[data-stat="efg_pct"]')
            .text(),
          freeThrowsMade: $(row).find('td[data-stat="ft_per_g"]').text(),
          freeThrowsAttempted: $(row).find('td[data-stat="fta_per_g"]').text(),
          freeThrowPercentage: $(row).find('td[data-stat="ft_pct"]').text(),
          offensiveRebounds: $(row).find('td[data-stat="orb_per_g"]').text(),
          defensiveRebounds: $(row).find('td[data-stat="drb_per_g"]').text(),
          totalRebounds: $(row).find('td[data-stat="trb_per_g"]').text(),
          assists: $(row).find('td[data-stat="ast_per_g"]').text(),
          steals: $(row).find('td[data-stat="stl_per_g"]').text(),
          blocks: $(row).find('td[data-stat="blk_per_g"]').text(),
          turnovers: $(row).find('td[data-stat="tov_per_g"]').text(),
          personalFouls: $(row).find('td[data-stat="pf_per_g"]').text(),
          pointsPerGame: $(row).find('td[data-stat="pts_per_g"]').text(),
        };
        players.push(player);
      });

      res.json(players);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving players");
    });
});

app.get("/points-leaders", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.basketball-reference.com/leagues/NBA_2023_leaders.html"
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const divLeaders = $("#div_leaders");
    const dataGridBoxes = divLeaders.find(".data_grid_box");
    const tables = dataGridBoxes.find("table");

    const results = [];

    tables.each((i, table) => {
      const tableRows = $(table).find("tbody tr");
      const tableData = [];

      tableRows.each((j, row) => {
        const rowData = {};

        $(row)
          .find("td")
          .each((k, cell) => {
            const cellText = $(cell).text().trim();

            if (k === 1) {
              const [playerName, teamName] = cellText
                .split("•")
                .map((t) => t.trim());
              rowData["playerName"] = playerName;
              rowData["teamName"] = teamName;
            } else {
              rowData[`col${k}`] = cellText;
            }
          });

        tableData.push(rowData);
      });

      const categoryName = $(table).find("caption").text().trim();

      results.push({
        tableId: $(table).attr("id"),
        categoryName,
        tableData,
      });
    });

    // Send response
    res.json({
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


app.get("/player", async (req, res) => {
  const playerName = req.query.name;
  let player = playerName.split(' ')
  let playerFirstName = player[0].split('')
  let playerLastName = player[1].split('')
  let lastName = []
  let firstName = []
  // console.log(`Player name: ${[player[1].length]}`);

  for(let i = 0; i < playerFirstName.length; i++) {
    if(i < 2) {
      firstName.push(playerFirstName[i])
    }
  }
  let firstNameDone = firstName.join('').toLowerCase()
  for(let i = 0; i < playerLastName.length ; i++) {
    if(i < 5) {
      lastName.push(playerLastName[i])
    }
  }
  let lastNameDone = lastName.join('').toLowerCase()
  try {
    const response = await axios.get(
      `https://www.basketball-reference.com/players/${lastNameDone[0]}/${lastNameDone + firstNameDone}01.html`
    );
    const $ = cheerio.load(response.data);

    // Extract player name
    const playerName = $("h1 span").text();

    // Extract player positions
    const positionsElement = $('p:contains("Position:")').eq(0);
    const positions = positionsElement
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .replace("Position:", "")
      .trim();

    // Extract player height and weight
    const heightWeightElements = $('p:contains("cm"), p:contains("lb")');
    const heightWeight = heightWeightElements.first().text().trim();

    // Extract player birthdate
    const birthdate = $('p strong:contains("Born")')
      .next()
      .find("a")
      .first()
      .text();

    // Extract college
    const college = $('p strong:contains("College")').next().text().trim();

    // Extract draft information
    const draft = $('p strong:contains("Draft")').next().text().trim();

    // Extract NBA debut date
    const debutDate = $('p strong:contains("NBA Debut")')
      .next()
      .find("a")
      .first()
      .text();

    // Extract player image URL
    const playerImage = $(".media-item img").attr("src");

    // Extract player game log
    const gameLogTable = $("#per_game tbody");
    const gameLog = gameLogTable
      .find("tr")
      .map((i, el) => {
        const tds = $(el).find("td");
        return {
          season: $(el).find("th a").text(),
          age: tds.eq(0).text(),
          team: tds.eq(1).text(),
          league: tds.eq(2).text(),
          position: tds.eq(3).text(),
          games: tds.eq(4).text(),
          gamesStarted: tds.eq(5).text(),
          minutesPlayed: tds.eq(6).text(),
          fieldGoals: tds.eq(7).text(),
          fieldGoalAttempts: tds.eq(8).text(),
          fieldGoalPercentage: tds.eq(9).text(),
          threePointers: tds.eq(10).text(),
          threePointAttempts: tds.eq(11).text(),
          threePointPercentage: tds.eq(12).text(),
          twoPointers: tds.eq(13).text(),
          twoPointAttempts: tds.eq(14).text(),
          twoPointPercentage: tds.eq(15).text(),
          effectiveFieldGoalPercentage: tds.eq(16).text(),
          freeThrows: tds.eq(17).text(),
          freeThrowAttempts: tds.eq(18).text(),
          freeThrowPercentage: tds.eq(19).text(),
          offensiveRebounds: tds.eq(20).text(),
          defensiveRebounds: tds.eq(21).text(),
          totalRebounds: tds.eq(22).text(),
          assists: tds.eq(23).text(),
          steals: tds.eq(24).text(),
          blocks: tds.eq(25).text(),
          turnovers: tds.eq(26).text(),
          personalFouls: tds.eq(27).text(),
          points: tds.eq(28).text(),
        };
      })
      .get();
      // Create a player object
const player = {
  playerName,
  positions,
  heightWeight,
  birthdate,
  college,
  draft,
  debutDate,
  playerImage,
  gameLog,
  };
  
  // Return the player object as a JSON response
  res.json(player);
  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
  }
  });


app.get("/schedule", async (req, res) => {
  try {
    const response = await axios.get("https://www.basketball-reference.com/");
    const html = response.data;
    const $ = cheerio.load(html);
    const games = [];

    // loop through each game summary element
    $("#scores .game_summary.expanded.nohover").each((i, gameSummary) => {
      const game = {};

      // scrape the team names and scores from the winner and loser rows
      const winner = $(gameSummary).find(".winner");
      const loser = $(gameSummary).find(".loser");
      game.awayTeamFull = winner.find("td:nth-child(1) a").text().trim();
      game.awayScore = winner.find("td:nth-child(2)").text().trim();
      game.homeTeamFull = loser.find("td:nth-child(1) a").text().trim();
      game.homeScore = loser.find("td:nth-child(2)").text().trim();

      // extract the game ID from the boxscore URL
      const gameLink = $(gameSummary).find("td.gamelink a").first();
      const href = gameLink.attr("href");
      const gameId = href.split("/")[2].split(".")[0];

      // construct the boxscore URL using the game ID
      game.link = `https://www.basketball-reference.com${href}`;
      gameLink.attr("href", game.link);

      // scrape the scores by quarter from the table body
      game.scores = [];
      $(gameSummary)
        .find(".teams + table tbody")
        .each((j, quarterScore) => {
          const homeScore1 = $(quarterScore)
            .find("td:nth-child(1)")
            .text()
            .trim();
          const homeScore2 = $(quarterScore)
            .find("td:nth-child(2)")
            .text()
            .trim();
          const homeScore3 = $(quarterScore)
            .find("td:nth-child(3)")
            .text()
            .trim();
          const homeScore4 = $(quarterScore)
            .find("td:nth-child(4)")
            .text()
            .trim();
          const homeScore5 = $(quarterScore)
            .find("td:nth-child(5)")
            .text()
            .trim();

          if (homeScore1 !== "") {
            game.scores = [
              homeScore1,
              homeScore2,
              homeScore3,
              homeScore4,
              homeScore5,
            ];
          }
        });

      games.push(game);
    });
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.get('/boxscores', async (req, res) => {

  const url = req.query.url;
  const response = await axios.get(url);

  const html = response.data;
  const $ = cheerio.load(html);

  const tableData = [];

  $('tr').each((i, element) => {
    const th = $(element).find('th');
    const tds = $(element).find('td');
    const rowData = {};

    if (!tds.length || !$(tds[0]).text().trim()) {
      return; // skip header row and rows for starters and team totals
    }

    th.each((j, th) => {
      const key = $(th).attr('data-stat');
      const value = $(th).text().trim();
      rowData[key] = value;
    });

    tds.each((j, td) => {
      const key = $(td).attr('data-stat');
      const value = $(td).text().trim();
      rowData[key] = value;
    });

    if (Object.keys(rowData).length > 0) {
      tableData.push(rowData);
    }
  });

  res.json(tableData);
});

// app.get('/picks', async (req, res) => {
//   try {
//     const response = await axios.get('https://www.cbssports.com/nba/expert-picks/');
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const picks = [];

//     $('div.picks-tr').each((i, element) => {
//       const homeTeam = $(element).find('div.game-info-team:nth-child(1) > span.team > a').text();
//       const awayTeam = $(element).find('div.game-info-team:nth-child(2) > span.team > a').text();
//       const overUnder = $(element).find('div.picks-td:nth-child(2) > div:nth-child(1) > span').text().trim();
//       const spread = $(element).find('div.picks-td:nth-child(2) > div:nth-child(2) > span').text().trim();
//       const expertSpread = $(element).find('div.picks-td:nth-child(3) > div > div.expert-spread').text().trim();
//       const expertOU = $(element).find('div.picks-td:nth-child(3) > div > div.expert-ou').text().trim();

//       const pick = {
//         homeTeam,
//         awayTeam,
//         overUnder,
//         spread,
//         expertSpread,
//         expertOU,
//       };

//       picks.push(pick);
//     });

//     const spreadPicks = $('.picks-spread .expert-label-data').text().trim();
//     const overUnderPicks = $('.picks-o-u .expert-label-data').text().trim();

//     const expertPicks = {
//       spreadPicks,
//       overUnderPicks
//     };

//     const result = {
//       picks,
//       expertPicks
//     };

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });

app.get('/picks', async (req, res) => {
  try {
    const response = await axios.get('https://www.cbssports.com/nba/expert-picks/');
    const html = response.data;
    const $ = cheerio.load(html);

    const picks = [];

    $('div.picks-tr').each((i, element) => {
      const homeTeam = $(element).find('div.game-info-team:nth-child(1) > span.team > a').text();
      const homeLogo = $(element).find('div.game-info-team:nth-child(1) > span.logo > div > a > figure > img').attr('data-lazy');
      const awayTeam = $(element).find('div.game-info-team:nth-child(2) > span.team > a').text();
      const awayLogo = $(element).find('div.game-info-team:nth-child(2) > span.logo > div > a > figure > img').attr('data-lazy');
      const overUnder = $(element).find('div.picks-td:nth-child(2) > div:nth-child(1) > span').text().trim();
      const spread = $(element).find('div.picks-td:nth-child(2) > div:nth-child(2) > span').text().trim();
      const expertSpread = $(element).find('div.picks-td:nth-child(3) > div > div.expert-spread').text().trim();
      const expertOU = $(element).find('div.picks-td:nth-child(3) > div > div.expert-ou').text().trim();
      const expertLogo = $(element).find('div.picks-td:nth-child(3) > div > div.expert-spread > div.expert-logo > div > a > figure > img').attr('data-lazy');
      const datetime = $(element).find('div.game-info-options > div.current-status > span[data-format-datetime]').attr('data-format-datetime');
      const match = /value\\?":\s?"(\d+)"/.exec(datetime);
      const timestamp = match ? match[1] : null;
      
      // Convert timestamp to human-readable time
      const time = timestamp ? new Date(timestamp * 1000).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true}) : '';
      



      const pick = {
        homeTeam,
        homeLogo,
        awayTeam,
        awayLogo,
        overUnder,
        spread,
        expertSpread,
        expertOU,
        expertLogo,
        time
      };

      picks.push(pick);
    });

    const spreadPicks = $('.picks-spread .expert-label-data').text().trim();
    const overUnderPicks = $('.picks-o-u .expert-label-data').text().trim();

    const expertPicks = {
      spreadPicks,
      overUnderPicks
    };

    const result = {
      picks,
      expertPicks
    };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
