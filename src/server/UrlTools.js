const alphabet = 'JQBsYEuHk0oVid178CDhjG6qbF_3Az4vtaePc29ZLwTyXmKpUgrSM5fnxNRW';

class UrlTools {

    /**
     * Encode Mongo ID field
     * We are using a Bijective function, along with a predefined permissible characters
     * @param id
     * @returns {string}
     */
    static encode(id) {
        let res = '';
        let base = alphabet.length;
        while (id > 0) {
            let rem = id % base;
            id = (id - rem) / base;
            res += alphabet.charAt(rem);
        }

        return res.split("").reverse().join("");
    }

    /**
     * decode shortened URL to Mongo ID
     * @param smallUrl
     * @returns {number}
     */
    static decode(smallUrl) {
        let id = 0;
        for (let i = 0; i < smallUrl.length; i++) {
            id += alphabet.indexOf(smallUrl.charAt(i)) * Math.pow(alphabet.length, (smallUrl.length - (i + 1)))
        }
        return id;
    }
}

module.exports = UrlTools;