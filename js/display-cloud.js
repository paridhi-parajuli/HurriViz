/*
    displayClouds takes in name and year of the hurricane 
    and shows the cloud satellite imagery at a particular 
    timestamp. 
*/

const cloudSources = {
    "2017-08-29 00:00:00": {
        "source": "goes_HARVEY_2017082900-88bmsd",
        "url": "mapbox://anisbhsl.0q3zp1da"
    },
    "2017-08-28 18:00:00": {
        "source": "goes_HARVEY_2017082818-94q74k",
        "url": "mabox://anisbhsl.c6frk6wn"
    },
    "2017-08-28 12:00:00": {
        "source": "oes_HARVEY_2017082812-c3tk4u",
        "url": "mabox://anisbhsl.1kr04l2s"
    },
    "2017-08-28 06:00:00": {
        "source": "goes_HARVEY_2017082806-2gpwji",
        "url": "mabox://anisbhsl.5wnf9xie"
    },
    "2017-08-28 00:00:00": {
        "source": "goes_HARVEY_2017082800-8a8iv5",
        "url": "mabox://anisbhsl.cuuye7yl"
    },
    "2017-08-27 18:00:00": {
        "source": "goes_HARVEY_2017082718-5mmu1v",
        "url": "mabox://anisbhsl.39ie83ni"
    },
    "2017-08-27 12:00:00": {
        "source": "goes_HARVEY_2017082712-1mqtxh",
        "url": "mabox://anisbhsl.65w6hh5s"
    },
    "2017-08-27 06:00:00": {
        "source": "goes_HARVEY_2017082706-cth99o",
        "url": "mabox://anisbhsl.8f4edv1v"
    }
}

const displayClouds = (name, year) => {
    if (name === "HARVEY") {

    } else {
        //TODO: Do something here
    }

}

const hurricaneName = "CRISTOBAL";
const year = 2020;

displayClouds(hurricaneName, year);
