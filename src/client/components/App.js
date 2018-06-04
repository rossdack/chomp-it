import React, {Component} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import DataSource from './DataSource';
import FormValidator from './FormValidator';
import Err404 from './Err404';

import 'typeface-montserrat';

const decodeHostName = window.location.href;

const centEl = {
    marginLeft: 'auto',
    marginRight: 'auto'
};

const divDisplay = {
    ...centEl,
    isValid: true,
    textAlign: 'center',
    verticalAlign: 'middle',
    fontFamily: 'Montserrat'
};

const shortUrlControl = {
    ...centEl,
    fontFamily: 'Montserrat',
    border: '1px solid rgb(206, 212, 218)',
    maxWidth: '500px',
    width: '400px',
    borderRadius: '.25rem',
    display: 'flex',
    marginTop: '20px'
};

const shortUrlText = {
    padding: '.375rem .75rem',
    lineHeight: '1.5',
    backgroundClip: 'padding-box',
    textAlign: 'left',
    flexGrow: '2'
};

const errorBlock = {
    ...centEl,
    fontFamily: 'Montserrat',
    color: 'red'
};

const content = {
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
};

const hasError = {
    border: '1px solid red'
};

let innerContainer = {
    ...centEl,
    marginTop: '20px',
    maxWidth: '400px',
    display: 'flex',
};

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
    constructor(props) {
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
            validation: this.validator.valid(),
            notFound: (window.location.search).indexOf('?e') > -1
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

        if (this.state.notFound) {
            return (
                <div style={divDisplay}>
                    <div style={headerText}></div>
                    <div className='form-group text-center'>
                        <div style={innerContainer}>
                            <Err404/>
                        </div>
                    </div>
                 </div>);
        }

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
                                   placeholder={'Paste a link to shorten it'}
                                   disabled={this.state.submitted}
                                   style={validation.urlInput.isInvalid ? hasError : null}
                                   onChange={({target: {value}}) => this.setState({
                                       urlInput: value,
                                       copied: false,
                                       shortUrl: null
                                   })}/>
                            <button className='btn btn-primary btn-sm' disabled={this.state.submitted} onClick={this.shorten.bind(this)}>Shorten URL
                            </button>

                        </div>
                        <div>
                            <span style={errorBlock}>{validation.urlInput.message}</span>
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
