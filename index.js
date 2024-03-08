const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const vurlParam = url.searchParams.get("Vurl");

    if (!vurlParam) {
      return res.status(400).send("Vurl parameter is missing");
    }

    const newUrl = url.toString().replace("https://sr-get-video59-selftoken.studyratna8.workers.dev/?Vurl=", "");
    const newUrl1 = newUrl.replace("mpd", "m3u8");
    const newUrl12 = newUrl1.split("/")[3];

    const requrl = 'https://api.penpencil.xyz/v1/files/get-signed-cookie';
    const headers = {
      'Authorization': `Bearer ${process.env.TOKEN}`,
      'Client-Id': '5c8f5d96a248bc40e600bfa4',
      'Client-Type': 'WEB',
      'Referer': 'https://www.pw.live/',
      'Content-Type': 'application/json',
      'Randomid': '1b40a397-82e2-49d9-8582-4a09a0410f8d',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Authority': 'api.penpencil.xyz'
    };
    const body = JSON.stringify({ "url": newUrl1 });

    const response = await axios.post(requrl, body, { headers });

    if (!response.data.ok) {
      return res.status(response.status).send(response.data);
    }
    const newUrl2 = `https://${newUrl1.split("/")[2]}/${newUrl12}/master.m3u8` + response.data.data;

    const Vdokey = newUrl2.split("/")[3];
    const Policy0 = newUrl2.split("/")[4];
    const Policy = Policy0.replace("master.m3u8", "");

    const response2 = await axios.get(newUrl2);

    if (!response2.data.ok) {
      return res.status(response2.status).send("unable to get m3u8 = " + newUrl2);
    }

    let m3u8Content = response2.data;

    m3u8Content = m3u8Content.replace(/\bhls\/\d+\/main\.m3u8\b/g, (match) => {
      return `https://sr-video-quality.studyratna8.workers.dev/?Vurl=https://${newUrl1.split("/")[2]}/${Vdokey}/${match}${Policy}`;
    });

    res.status(200).set({
      "Content-Type": "application/x-mpegURL",
      "Content-Disposition": `attachment; filename="modified.m3u8"`
    }).send(m3u8Content);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
