import axios from 'axios';

class DataSource {

    shrinkUrl(url) {
        console.log('Shrinking ', url);
        // (!)
        return axios.post('@@SHRINKREST',
            {
                long_url: url
            });
    }
}

export default DataSource;