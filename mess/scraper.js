const cheerio = require('cheerio')
const axios = require('axios')

const gempa = () => new Promise((resolve, reject) => {
  axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg').then((response) => {
  const $ = cheerio.load(response.data)

  const urlElems = $('table.table-hover.table-striped')

  for (let i = 0; i < urlElems.length; i++) {
    const urlSpan = $(urlElems[i]).find('tbody')[0]

    if (urlSpan) {
      const urlData = $(urlSpan).find('tr')[0]
      var Kapan = $(urlData).find('td')[1]
      var Letak = $(urlData).find('td')[2]
      var Magnitudo = $(urlData).find('td')[3]
      var Kedalaman = $(urlData).find('td')[4]
      var Wilayah = $(urlData).find('td')[5]
      var lintang = $(Letak).text().split(' ')[0]
      var bujur = $(Letak).text().split(' ')[2]
      var hasil = {
        Waktu: $(Kapan).text(),
        Lintang: lintang,
        Bujur: bujur,
        Magnitudo: $(Magnitudo).text(),
        Kedalaman: $(Kedalaman).text().replace(/\t/g, '').replace(/I/g, ''),
        Wilayah: $(Wilayah).text().replace(/\t/g, '').replace(/I/g, '').replace('-','').replace(/\r/g, '').split('\n')[0],
		Map: $('div.modal-body > div > div:nth-child(1) > img').attr('src'),
      }
      // We then print the text on to the console
      resolve(hasil);
    }
    console.log(hasil)
  }
  }).catch(err => reject(err))
})

async function covid(){
	return new Promise(async(resolve, reject) => {
		axios.get('https://covid19.go.id/')
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const hasil = [];
			$('#case > div > div > div > div > div:nth-child(2)').each(function(a,b) {
				const Positif_indo = $(b).find('div:nth-child(3) > strong').text()
				const Meninggal_indo = $(b).find('div:nth-child(5) > strong').text()
				const Sembuh_indo = $(b).find('div:nth-child(4) > strong').text()
				const Update_indo = $(b).find('div.pt-4.text-color-black.text-1').text().trim()
			$('#case > div > div > div > div > div:nth-child(1)').each(function(c,d) {
					const negara = $(d).find('div:nth-child(3) > strong').text() 
					const Positif_global = $(d).find('div:nth-child(4) > strong').text()
					const Meninggal_global = $(d).find('div:nth-child(5) > strong').text()
					const Update_global = $(d).find('div.pt-4.text-color-grey.text-1').text().trim()
				const result = {
				  status: 200,
					indo : {
						indoP: Positif_indo,
						indoM: Meninggal_indo,
						indoS: Sembuh_indo,
						indoU: Update_indo.split(':')[1]
					},
					global: {
						negara: negara,
						positif: Positif_global,
						meninggal: Meninggal_global,
						update: Update_global.split(':')[1].split('\n')[0]
					}
				}
				hasil.push(result)
				})
			})
			resolve(hasil[0])
		})
		.catch(reject)
	})
}

module.exports = { gempa,
covid }
