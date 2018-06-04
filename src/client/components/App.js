import React, {Component} from 'react';
import '../css/App.css';
import DataSource from './DataSource';
import CopyToClipboard from 'react-copy-to-clipboard';

const decodeHostName = '/decode/';

const divDisplay = {
    textAlign: 'center',
    verticalAlign: 'middle',
    fontFamily: 'Montserrat',
    marginLeft: 'auto',
    marginRight: 'auto'
};

const shortUrlControl = {
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '1px solid black',
    width: '322px'
};


class App extends Component {
    constructor() {
        super();
        this.state = {
            shortUrl: null,
            copied: false
        };

        this.dataSource = new DataSource();
    }

    shorten() {
        if (this.refs.urlInput.value) {
            this.dataSource.shrinkUrl(this.refs.urlInput.value).then(success => {
                this.setState({shortUrl: success.data.shortUrl});
            }).catch(failure => {
                console.log('An error occurred', failure);
            });
        }
    }

    copyUrl(e) {
        document.execCommand('copy')
        console.log('urlCopied', e);
    }

    render() {
        return (
            <div style={divDisplay}>
                <div className='main_text'>Minify, shorten your URLs!</div>
                <div className='control'>
                    <div className='form-group text-center'>
                        <input ref='urlInput' onChange={({target: {value}}) => this.setState({value, copied: false})} />
                        <button className='btn btn-primary btn-sm' onClick={this.shorten.bind(this)}>Shorten URL
                        </button>

                        {(this.state.shortUrl != null && (
                            <div style={shortUrlControl}>
                                <span ref='longUrl'>{decodeHostName+this.state.shortUrl}</span>

                                <CopyToClipboard text={decodeHostName+this.state.shortUrl} onCopy={() => this.setState({copied: true})}>
                                    <button className='btn btn-primary btn-sm'>Copy</button>
                                </CopyToClipboard>
                                {this.state.copied ? <span style={{color: 'red'}}>Copied</span> : null}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
