const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');
const axios = require('axios').default;
var itemsPerPage = 10;
var mcache = require('memory-cache');
const nepses = require("../model/nepsedata.js");
const images = require("../model/imagedata.js");


var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url;
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            res.send(cachedBody)
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }

            next()
        }
    }
}

router.get("/", (req, res) => {
    res.render("index");

});

router.get("/top-gain", cache(10), async (req, res) => {
    const gain = "top-gainer";
    var request = await top(gain);
    res.render("top-gain", { request: request });

});

router.get("/top-lose", cache(10), async (req, res) => {
    var db = req.db;
    var toplosser = "top-loser";
    var request = await top(toplosser);
    res.render("top-loss", { request: request });
});

router.get("/top-volume", cache(10), async (req, res) => {
    var turnover = "turnover";
    var request = await top(turnover);
    res.render("top-volume", { request: request });

});

router.get("/floorsheet", cache(10), (req, res) => {
 res.render("floorsheet",);

});

router.post('/submit', async (req, res) => {
const { date, securityID, page, size } = req.body;
const floor = await floorsheet(date, securityID, page, size);
res.render("floorsheet", { floor: floor, date: date, securityID: securityID, page: page, size: size });

});

async function top(datas) {
    const directors = await fetch(`http://api.allorigins.win/get?url=https://newweb.nepalstock.com.np/api/nots/top-ten/${datas}?all=true`).then(response => response.json());
    var mydata = JSON.stringify(directors);
    mydata = mydata.replace(/\\/g, '');
    var s = mydata.indexOf("[");
    var e = mydata.indexOf("]");
    mydata = mydata.slice(s, e + 1);
    mydata = JSON.parse(mydata);
    return mydata;
}


async function floorsheet(date, securityID, page, size) {

    try {
        const floor = await axios.get(`https://newweb.nepalstock.com.np/api/nots/security/floorsheet/${securityID}?page=${page}&size=${size}&businessDate=${date}&sort=contractId,asc`, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
        return (floor.data);
    } catch (error) {
        console.log(error);

    }
}


router.get("/nepsedata", cache(10), async (req, res) => {

    let nepse = [];

    try {
        const nepseSecurity = await axios.get(`https://newweb.nepalstock.com.np/api/nots/security`, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
        var count = Object.keys(nepseSecurity.data).length;
        var nepsecounts = nepseSecurity.data;
        for (nepsecount of nepsecounts) {
        await nepses({
                id: nepsecount.id,
                symbol: nepsecount.symbol,
                securityName: nepsecount.securityName,
                activeStatus: nepsecount.activeStatus,
        }).save();

        };

        return (count);

    } catch (error) {

        console.log(error);

    }

 res.render("nepsedata",);

});



router.get("/search", cache(10), (req, res) => {

res.render("search",);

});


router.get("/getdata", cache(10), async (req, res) => {
    try {
        var getmydata = await nepses.find();
        res.setHeader('Content-Type', 'text/plain');
        } 
    catch (error) {
            console.log(error)
    }
    res.send(getmydata);

});


router.get("/update", async (req, res) => {
try {
        var bigdata = [];
        var mydatas = await nepses.find();
        res.render('update', { mydata: mydatas });

        // var j;

        //         for(mydata of mydatas){
        //             datas={
        //                 id:mydata.id,
        //                 symbol:mydata.symbol,
        //                 securityName:mydata.securityName,
        //                 activeStatus:mydata.activeStatus,
        //             };
        //             bigdata.push(datas);
        //             j++


        //         };


        // res.render("update",{mydata:mydatas});

    } catch (error) {
        console.log(error);

    }
});



router.get("/update/add", async (req, res) => {

    res.render("crud/add");


});





router.post("/update/addupdate", async (req, res) => {


    try {
        var editdata = await req.body;
        res.render("crud/addupdate", { edit: editdata });

    } catch (error) {
        res.render("couldnt load the content ");

    }

});




router.get("/update/addupdate", (req, res) => {
res.render("crud/addupdate");
    // res.render("./crud/addupdate");//

});






router.post("/update/addupdates", async (req, res) => {
    const status = 201;
    await nepses.updateOne({ id: req.body.id }, { $set: { securityName: req.body.securityName } }).then(function (data, error) {
        if (error) {
            console.log(error);
        } else {

        }

    })

    res.render("crud/addupdate", { edit: "" });


});



router.get("/update/delete", async (req, res) => {


    res.render("crud/delete");
});


router.post("/update", async (req, res) => {


    status = 201;

    try {

        console.log(req.body.id);
        await nepses.deleteOne({ id: req.body.id });
        res.redirect("update");

    } catch (error) {

    }

});

// res.redirect(status,"update" );
// await res.redirect(status,"");


router.post("/update/submit", async (req, res) => {

    const mydata = req.body;
    await nepses(mydata).save();

    status = 201;

    result = "succesfully added"

    res.redirect(status, "add");


});



router.get("/fileupdate", async (req, res) => {
res.render("fileupdate");
});



router.post("/fileupdate", async (req, res) => {
    console.log(req.body);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.file;
    uploadPath = __dirname + '/uploads/' + sampleFile.name;
    const mypath = sampleFile.name;

    sampleFile.mv(uploadPath, async (err) => {

        if (err) {
            return res.status(500).send(err);
        } else {

            await images({ file: mypath }).save();

            res.send("fileupploaded succesfully");
        }
    })


});


//load the image 
router.get('/loadmage', async (req, res) => {
var image = await images.find();
var count = Object.keys(image).length;
// res.setHeader('Content-Type', 'text/plain');
res.render("loadmage", { image: image, count: count });

})








router.post("/nepsearch", async (req, res) => {
    try {
        await nepses.find({ $text: { $search: req.body.npsearch } }, (err, data) => {

            if (err) {
                console.log(err + "hello 2");


            } else {
                console.log(data);
                res.render("search", { searchdata: data });
            }
        });

        // console.log(searchdata);
        // res.render("search",{searchdata:searchdata});


    } catch (error) {

        console.log(error + "hello 1");
        res.render("search", { searchdata: error });

        // res.render("search",{searchdata:null});
    }
});


module.exports = router;