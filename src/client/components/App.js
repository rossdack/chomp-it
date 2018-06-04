import React, {Component} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import DataSource from './DataSource';
import FormValidator from './FormValidator';

const decodeHostName = '/decode/';

const centEl = {
    marginLeft: 'auto',
    marginRight: 'auto',
};

const divDisplay =
    //...centEl,
    Object.assign({
        centEl,
        isValid: true,
        textAlign: 'center',
        verticalAlign: 'middle',
        fontFamily: 'Montserrat',
    });

const shortUrlControl = Object.assign({
    //...centEl,
    centEl,
    fontFamily: 'Montserrat',
    border: '1px solid rgb(206, 212, 218)',
    maxWidth: '400px',
    borderRadius: '.25rem',
    display: 'flex',
    marginTop: '20px'
});

const shortUrlText = {
    padding: '.375rem .75rem',
    lineHeight: '1.5',
    backgroundClip: 'padding-box',
    textAlign: 'left',
    flexGrow: '2'
};

const errorBlock = Object.assign({
    centEl,
    fontFamily: 'Montserrat',
    color: 'red'
});

const content = {
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
};

const hasError = {
    border: '1px solid red'
};

const innerContainer = Object.assign({
    centEl,
    marginTop: '20px',
    maxWidth: '400px',
    display: 'flex',
});

const copiedIndicatorContainer = {
    display: 'inline-block'
};

const copiedIndicator = {
    color: 'green'
};

const headerText = {
    fontSize: 'larger',
    fontWeight: '600'
};

class App extends Component {
    constructor() {
        super();

        this.validator = new FormValidator([
            {
                field: 'urlInput',
                method: 'isURL',
                validWhen: true,
                message: '* A valid URL is required.'
            }
        ]);

        this.state = {
            urlInput: '',
            shortUrl: null,
            copied: false,
            backendError: false,
            submitted: false,
            validation: this.validator.valid()
        };

        this.dataSource = new DataSource();
    }

    /**
     *
     * @param event
     */
    shorten(event) {
        event.preventDefault();

        const validation = this.validator.validate(this.state);
        this.setState({validation, backendError: false, submitted: true});

        if (validation.isValid) {
            this.dataSource.shrinkUrl(this.refs.urlInput.value).then(success => {
                this.setState({shortUrl: success.data.shortUrl, submitted: false});
            }).catch(failure => {
                this.setState({backendError: true, submitted: false});
                console.log('An error occurred', failure);
            });
        } else {
            this.setState({submitted: false});
        }
    }

    render() {
        let validation = this.submitted ? this.validator.validate(this.state) : this.state.validation;

        return (
            <div style={divDisplay}>

                <div style={content}>
                    <div style={headerText}>Shorten your URLs!</div>
                    <div className='form-group text-center'>
                        <div style={innerContainer}>
                            <input type='url'
                                   name='urlInput'
                                   ref='urlInput'
                                   className={'form-control'}
                                   placeholder={'Paste a link to shorten in'}
                                   disabled={this.state.submitted}
                                   // style={validation.urlInput.isInvalid ? hasError : null}
                                   onChange={({target: {value}}) => this.setState({
                                       urlInput: value,
                                       copied: false,
                                       shortUrl: null
                                   })}/>
                            <button className='btn btn-primary btn-sm' disabled={this.state.submitted} onClick={this.shorten.bind(this)}>Shorten URL
                            </button>
                        </div>
                        <div>
                            {/*{validation.urlInput.message}*/}
                            <span style={errorBlock}></span>
                        </div>

                        {(validation.isValid && this.state.shortUrl != null && this.state.urlInput !== '' && (
                            <div>
                                <div style={shortUrlControl}>
                                    <div style={shortUrlText} ref='longUrl'>{decodeHostName+this.state.shortUrl}</div>

                                    <CopyToClipboard text={decodeHostName+this.state.shortUrl} onCopy={() => this.setState({copied: true})}>
                                        <button className='btn btn-primary btn-sm'>Copy</button>
                                    </CopyToClipboard>
                                </div>
                                <div style={copiedIndicatorContainer}>
                                    {this.state.copied ? <span style={copiedIndicator}>Copied</span> : null}
                                </div>
                            </div>
                        ))}

                        {(this.state.backendError !== false && (
                            <div style={errorBlock}>
                                <span>Ooops! Something went wrong. Try again later.</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
