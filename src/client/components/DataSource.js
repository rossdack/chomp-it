import axios from 'axios';

class DataSource {

    shrinkUrl(url) {
        console.log('Shrinking ', url);
        return axios.post('http://localhost:8000/shorten',
            {
                long_url: url
            });
    }
}

export default DataSource;